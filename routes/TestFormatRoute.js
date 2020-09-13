const express = require('express');
const Router= express.Router();
const TestFormatController = require("./controllers/TestFormatController");
const AttemptController = require("./controllers/AttemptsController");
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
        var attemptResult = await AttemptController.getAttempts({"Test":result.data._id});
    if(result.code == 1 && attemptResult.code != -1){
        res.render("layout/admin/test_detail.hbs",{test:result.data,attempts:attemptResult.data})
    }else{     
        res.send("error page:"+result.message+attemptResult.message);  
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

Router.delete("/:testId/delete",async(req,res)=>{
    var result = await TestFormatController.deleteTest(req,res);
    ResponseManager(req,res,result)
})

module.exports = Router;
