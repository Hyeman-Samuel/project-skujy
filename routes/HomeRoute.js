const express = require('express');
const Router = express.Router();
const CompetitionController = require("./controllers/CompetitionController");
const {CompetitionStage} =require("../models/CompetitionFormat")



Router.get("/register",async(req,res)=>{ 
    var exams = await CompetitionController.getAllCompetition({Stage:CompetitionStage.Registration})
    if(exams.code == -1){
        res.sendStatus(500)
    }
    res.render("layout/user/registration.hbs",{"layout":"user/user_layout.hbs","exams":exams.data,"errors":req.session.errors})
    req.session.errors = null
})

Router.get("/competition",async(req,res)=>{ 
    var exams = await CompetitionController.getAllCompetition({Stage:CompetitionStage.Started})
    if(exams.code == -1){
        res.sendStatus(500)
    }
    res.render("layout/user/competition.hbs",{"layout":"user/user_layout.hbs","exams":exams.data,"errors":req.session.errors})
    req.session.errors = null
})



module.exports = Router