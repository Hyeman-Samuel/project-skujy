const express = require('express');
const Router= express.Router();
const TestFormatController = require("./controllers/TestFormatController")


Router.post("/",async(req,res)=>{ 
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
