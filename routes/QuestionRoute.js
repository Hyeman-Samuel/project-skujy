const express = require('express');
const Router= express.Router();
const QuesionController = require("./controllers/QuestionController");
const ValidateQuestion = require('../public/models/PublicQuestion');


Router.post("/",async(req,res)=>{ 
    const {error}=ValidateQuestion(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

    res.send(await QuesionController.createQuestion(req,res));
})

Router.get("/",async(req,res)=>{
    res.send(await QuesionController.getQuestions(req,res));
})


Router.get("/:id", async(req,res)=>{
 res.send(await QuesionController.getById(req,res));
})


Router.post("/edit/:id", async(req,res)=>{
    const {error}=ValidateQuestion(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

   res.send(await QuesionController.updateQuestion(req,res));
})

Router.delete("/delete/:id",async(req,res)=>{
   res.send(await QuesionController.deleteQuestion(req,res));
})

module.exports = Router  

/////This Route Most likely would not be used 
//// I just used it for testing