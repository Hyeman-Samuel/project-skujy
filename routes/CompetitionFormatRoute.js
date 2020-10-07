const express = require('express');
const Router= express.Router();
const {Logger} = require("../utility/Logger");
const CompetitionFormatController = require("./controllers/CompetitionController");
const AttemptController = require("./controllers/AttemptsController");
const Paystack = require("../utility/Paystack");
const ResponseManager = require('../utility/ResponseManager');
const CompetitionController = require('./controllers/CompetitionController');



Router.post("/entry", async(req,res)=>{
const form = await CompetitionFormatController.MakeEntryPayment(req)
    Paystack.initializePayment(form,(err,body)=>{
        if(err)return {message:err,code:-1}
        const response = JSON.parse(body);
        if(response.status){
            res.redirect(response.data.authorization_url)      
        }else{res.sendStatus(500)
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
            await CompetitionController.AddEntry(response)           
                }  
            verify()          
            res.redirect("/");
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





module.exports = Router  