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

Router.put("/:attemptId/addbatch",async (req,res)=>{
    const {error}=ValidateSubmittedAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

   var result = await AttemptController.submitBatchOfAttempts(req,res)
   ResponseManager(req,res,result)
})

Router.put("/:attemptId/submit",async (req,res)=>{
    const {error}=ValidateSubmittedAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

   var result = await AttemptController.submitAttempt(req,res)
   ResponseManager(req,res,result)
})

module.exports = Router