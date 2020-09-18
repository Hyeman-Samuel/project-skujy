const express = require('express');
const Router= express.Router();
const TestFormatController = require("./controllers/TestFormatController");
const AttemptController = require("./controllers/AttemptsController");
const ResponseManager = require('../utility/ResponseManager');



Router.get("/:id", async(req,res)=>{
    var result = await TestFormatController.getById(req,res);
        var attemptResult = await AttemptController.getAttempts(req,{"Test":result.data._id});
    if(result.code == 1 && attemptResult.code != -1){
        res.render("layout/admin/test_detail.hbs",{test:result.data,attemptData:attemptResult.data})
    }else{     
        res.send("error page:"+result.message+attemptResult.message);  
    }
})




Router.get("/:testId/close",async(req,res)=>{ 
    var result = await TestFormatController.closeTest(req,res);
    if(result.code == -1){
        res.send("err")
    }
    res.redirect(`/test/${req.params.testId}`)
})


Router.get("/:testId/open",async(req,res)=>{ 
    var result = await TestFormatController.openTest(req,res);
    if(result.code == -1){
        res.send("err")
    }
    res.redirect(`/test/${req.params.testId}`)
})

Router.delete("/:testId/delete",async(req,res)=>{
    var result = await TestFormatController.deleteTest(req,res);
    ResponseManager(req,res,result)
})

module.exports = Router;


// Router.get("/:id/attempts", async(req,res)=>{
//     var result = await TestFormatController.getAttempts(req,res);
//     ResponseManager(req,res,result)
// })


// Router.post("/",async(req,res)=>{ 
//     const {error}=ValidateTestFormat(req.body);         
//     if(error)return res.status(400).send(error.details[0].message);
    
//     var result = await TestFormatController.createTestFormat(req,res);
//     ResponseManager(req,res,result)
// })