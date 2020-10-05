const express = require('express');
const Router= express.Router();
const {Logger} = require("../utility/Logger");
const CompetitionFormatController = require("./controllers/CompetitionController");
const AttemptController = require("./controllers/AttemptsController");
const Paystack = require("../utility/Paystack");
const ResponseManager = require('../utility/ResponseManager');



Router.post("/entry", async(req,res)=>{
const form = CompetitionFormatController.MakeEntryPayment(req)
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
    verifyPayment(ref,(err,body)=>{
        if(err){
            return {message:err,code:-1};
        }
        const response = JSON.parse(body);
        if(response.status){   
        async function verify(){
            var entry = new Entry({
                "Email":response.data.email,
                "AmountPaid":response.data.amount,
                "ExamNumber":generateCode(3),
                "FullName":response.data.full_name,
                "Competition":response.data.metadata.CompetitionId
            })
                await entry.save()   
                return entry            
                }            
            res.send(verify());
        }else{
            Logger.error("error with paystack",response)
            return {message:"UnSuccessful",code:-1}
        }   
    })
})


Router.delete("/:compId/delete",async(req,res)=>{
    var result = await CompetitionFormatController.deleteCompetition(req,res);
    ResponseManager(req,res,result)
})



function generateCode(digits) {  
    var numbers = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < digits; i++ ) { 
        OTP += numbers[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

module.exports = Router  