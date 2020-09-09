const express = require('express');
const Router= express.Router();
const AttemptController = require("../routes/controllers/AttemptsController");
const {ValidateAttempt,ValidateSubmittedAttempt} = require('../public_models/PublicAttempt');
const ResponseManager = require('../utility/ResponseManager');

Router.post("/start",async(req,res)=>{ 
    const {error}=ValidateAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

    var result = await AttemptController.createAttempt(req,res)
     ResponseManager(req,res,result)
})

Router.get("/:attemptId/quiz",async(req,res)=>{
    var result  = await AttemptController.getAttempt(req,res);
    
    if(result.code == 1){
    var data = result.data
    console.log(data.QuestionsAttempted)
    res.render("quiz_page.hbs",{"layout":null,data});
    }else{
    res.send("error page");
    } 
})

Router.put("/:attemptId/addbatch",async (req,res)=>{
    const {error}=ValidateSubmittedAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

   var result = await AttemptController.submitBatchOfAttempts(req,res)
   ResponseManager(req,res,result)
})

Router.post("/:attemptId/submit",async (req,res)=>{
    const {error}=ValidateSubmittedAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

   var result = await AttemptController.submitAttempt(req,res)
   ResponseManager(req,res,result)
})

module.exports = Router