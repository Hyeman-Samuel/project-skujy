const express = require('express');
const Router = express.Router();
const TestController = require("./controllers/TestFormatController");
const CompetitionController = require("./controllers/CompetitionController");
const {CompetitionStage} =require("../models/CompetitionFormat")

Router.get("/admin",async(req,res)=>{
    res.render("admin/admin_index.hbs")
})

Router.get("/",async(req,res)=>{ 

    var testResult = await TestController.getAllTests({IsClosed:false})
    var examResult = await CompetitionController.getAllCompetition({Stage:CompetitionStage.Registration})
    if(testResult.code == -1){
        //res.send("error page")
        res.sendStatus(500)
    }
    res.render("index.hbs",{"layout":null,"tests":testResult.data,"exams":examResult.data,"errors":req.session.errors})
    req.session.errors = null
})



module.exports = Router 