const express = require('express');
const Router= express.Router();
const {Logger} = require("../utility/Logger");
const CompetitionFormatController = require("./controllers/CompetitionController");
const {CompetitionFormat} = require("../models/CompetitionFormat")
const AttemptController = require("./controllers/AttemptsController");
const Paystack = require("../utility/Paystack");
const ResponseManager = require('../utility/ResponseManager');
const CompetitionController = require('./controllers/CompetitionController');
const { check, validationResult } = require('express-validator');


Router.post("/entry",validateRegistration(),async(req,res)=>{
    var errors = validationResult(req).array()
    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect("/home/register");
        return
    }


    const competition = await CompetitionFormat.findById(req.body.Competition).populate(["Course","Registrations"]).lean()
    if(competition == null){
        var error = {msg:"Competition Not Found",param:""}
        req.session.errors =[error]
        res.redirect("/home/register");
        return
    }
    
    var hasRegistered = false
    competition.Registrations.forEach(entry => {
        if(entry.Email === req.body.Email){
            hasRegistered = true;
        }
    });

    if(hasRegistered){
        var error = {msg:"You Have already registered",param:""}
        req.session.errors =[error]
        res.redirect("/home/register");
        return
    }

const form = await CompetitionFormatController.MakeEntryPayment(req)
    Paystack.initializePayment(form,(err,body)=>{
        if(err)return {message:err,code:-1}
        const response = JSON.parse(body);
        if(response.status){
            res.redirect(response.data.authorization_url)      
        }else{
        var error = {msg:"Failed to process payment",param:""}
        req.session.errors =[error]
        res.redirect("/home/register");
        Logger.error("Paystack fail",response)
            return {message:"UnSuccessful",code:-1}
        }; 
    })    
})




Router.get("/callback",async(req,res)=>{ 
    const ref = req.query.reference;
Paystack.verifyPayment(ref,(err,body)=>{
        if(err){
            return {message:err,code:-1};
        }
        const response = JSON.parse(body);
        if(response.status){   
        async function verify(){            
        var result = await CompetitionController.AddEntry(response) 
            if(result.code == 1){          
                res.render("layout/user/payment_comfirmation.hbs",{"layout":"user/user_layout.hbs","entry":result.data})   
            }else{
                Logger.error("error when adding entry",result.message)
            }
        }  
            verify()          
            
        }else{
            Logger.error("error with paystack",response)
            return {message:"UnSuccessful",code:-1}
        }   
    })
})


Router.get("/:compId", async(req,res)=>{
    var result = await CompetitionFormatController.getById(req,res);
    if(result.code == 1){
        res.render("layout/admin/competition_detail.hbs",{competition:result.data})
    }else{     
        res.sendStatus(500) 
    }
})

Router.get("/:compId/registration", async(req,res)=>{
    var result = await CompetitionFormatController.StartRegisterStage(req,res)
    if(result.code == 1){
        res.redirect(`/competition/${req.params.compId}`)
    }else{     
        res.sendStatus(500) 
    }
})

Router.get("/:compId/start", async(req,res)=>{
    var result = await CompetitionFormatController.StartCompetitionStage(req,res)
    if(result.code == 1){
        res.redirect(`/competition/${req.params.compId}`)
    }else{     
        res.sendStatus(500) 
    }
})
Router.get("/:compId/end", async(req,res)=>{
    var result = await CompetitionFormatController.EndStage(req,res)
    if(result.code == 1){
        res.redirect(`/competition/${req.params.compId}`)
    }else{     
        res.sendStatus(500) 
    }
})

Router.delete("/:compId/delete",async(req,res)=>{
    var result = await CompetitionFormatController.deleteCompetition(req,res);
    ResponseManager(req,res,result)
})


function validateRegistration(){
    return [
        check('Email', 'Email is required')
        .isEmail(),
        check('FullName')
        .not()
        .isEmpty()
        .withMessage('Full Name Required')  
    ]
}

module.exports = Router  