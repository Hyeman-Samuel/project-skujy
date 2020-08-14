const express = require('express');
const Router= express.Router();
const TestFormatController = require("./controllers/TestFormatController");
const ValidateTestFormat = require('../public/models/PublicTestFormat');


Router.post("/",async(req,res)=>{ 
    const {error}=ValidateTestFormat(req.body);         
    if(error)return res.status(400).send(error.details[0].message);
    
    res.send(await TestFormatController.createTestFormat(req,res));
})

Router.get("/:id", async(req,res)=>{
 res.send(await TestFormatController.getById(req,res));
})



Router.post("/close/:testId",async(req,res)=>{ 
    res.send(await TestFormatController.closeTest(req,res));
})

Router.post("/open/:testId",async(req,res)=>{ 
    res.send(await TestFormatController.openTest(req,res));
})

Router.post("/delete/:testId",async(req,res)=>{
    res.send(await TestFormatController.deleteTest(req,res));
})

module.exports = Router;
