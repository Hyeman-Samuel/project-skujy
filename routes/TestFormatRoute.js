const express = require('express');
const Router= express.Router();
const TestFormatController = require("./controllers/TestFormatController");
const ValidateTestFormat = require('../public_models/PublicTestFormat');
const ResponseManager = require('../utility/ResponseManager');


// Router.post("/",async(req,res)=>{ 
//     const {error}=ValidateTestFormat(req.body);         
//     if(error)return res.status(400).send(error.details[0].message);
    
//     var result = await TestFormatController.createTestFormat(req,res);
//     ResponseManager(req,res,result)
// })

Router.get("/:id", async(req,res)=>{
    var result = await TestFormatController.getById(req,res);

    if(result.code == 1){
        res.render("layout/admin/test_detail.hbs")
    }else{     
        res.send("error page");  
    }
})


Router.get("/:id/attempts", async(req,res)=>{
    var result = await TestFormatController.getAttempts(req,res);
    ResponseManager(req,res,result)
})




Router.post("/close/:testId",async(req,res)=>{ 
    var result = await TestFormatController.closeTest(req,res);
    ResponseManager(req,res,result)
})

Router.post("/open/:testId",async(req,res)=>{ 
    var result = await TestFormatController.openTest(req,res);
    ResponseManager(req,res,result)
})

Router.post("/delete/:testId",async(req,res)=>{
    var result = await TestFormatController.deleteTest(req,res);
    ResponseManager(req,res,result)
})

module.exports = Router;
