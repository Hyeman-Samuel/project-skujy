const express = require('express');
const Router= express.Router();
const AttemptController = require("../routes/controllers/AttemptsController")

Router.post("/start",async(req,res)=>{ 
    res.send(await AttemptController.createAttempt(req,res))
})

Router.post("/:attemptId/submit",async (req,res)=>{
    res.send(await AttemptController.submitAttempt(req,res))
})

module.exports = Router