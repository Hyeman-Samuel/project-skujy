const express = require('express');
const Router= express.Router();
const AttemptController = require("../routes/controllers/AttemptsController");
const {ValidateAttempt,ValidateSubmittedAttempt} = require('../public/models/PublicAttempt');

Router.post("/start",async(req,res)=>{ 
    const {error}=ValidateAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);
    res.send(await AttemptController.createAttempt(req,res))
})

Router.post("/:attemptId/submit",async (req,res)=>{
    const {error}=ValidateSubmittedAttempt(req.body);         
    if(error)return res.status(400).send(error.details[0].message);
    res.send(await AttemptController.submitAttempt(req,res))
})

module.exports = Router