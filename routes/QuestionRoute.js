const express = require('express');
const Router= express.Router();
const QuesionController = require("./controllers/QuestionController");
const ValidateQuestion = require('../public_models/PublicQuestion');
const ResponseManager = require('../utility/ResponseManager');


// Router.post("/",async(req,res)=>{ 
//     const {error}=ValidateQuestion(req.body);         
//     if(error)return res.status(400).send(error.details[0].message);

//     var result = await QuesionController.createQuestion(req,res);
//     ResponseManager(req,res,result);
// })

// Router.get("/",async(req,res)=>{
//      var result = await QuesionController.getQuestions(req,res);
//      ResponseManager(req,res,result);
// })


// Router.get("/:id", async(req,res)=>{
//     var result = await QuesionController.getById(req,res);
    
//     ResponseManager(req,res,result);
// })

Router.get("/:id/edit", async(req,res)=>{

    var result = await QuesionController.getById(req,res);
    ResponseManager(req,res,result);
})

Router.post("/:id/edit", async(req,res)=>{
    const {error}=ValidateQuestion(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

    var result = await QuesionController.updateQuestion(req,res);
    ResponseManager(req,res,result);
})

Router.delete("/:id/delete",async(req,res)=>{
    var result = await QuesionController.deleteQuestion(req,res);
    ResponseManager(req,res,result);
})

module.exports = Router  

/////This Route Most likely would not be used 
//// Only the Delete is used