const express = require('express');
const Router= express.Router();
const QuesionController = require("./controllers/QuestionController")


Router.post("/",async(req,res)=>{ 
    res.send(await QuesionController.createQuestion(req,res));
})

Router.get("/",async(req,res)=>{
    res.send(await QuesionController.getQuestions(req,res));
})


Router.get("/:id", async(req,res)=>{
 res.send(await QuesionController.getById(req,res));
})


Router.post("/edit/:id", async(req,res)=>{
   res.send(await QuesionController.updateQuestion(req,res));
})

Router.delete("/delete/:id",async(req,res)=>{
   res.send(await QuesionController.deleteQuestion(req,res));
})

module.exports = Router  