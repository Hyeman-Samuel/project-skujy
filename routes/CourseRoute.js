const express = require('express');
const Router= express.Router();
//const QuesionController = require("./controllers/QuestionController")
const CourseController = require("./controllers/CourseController")


Router.post("/",async(req,res)=>{ 
    res.send(await CourseController.createCourse(req,res));
})

Router.get("/",async(req,res)=>{
    res.send(await CourseController.getCourses(req,res));
})

Router.get("/:id", async(req,res)=>{
 res.send(await CourseController.getById(req,res));
})

Router.get("/:id/test",async(req,res)=>{
    res.send(await CourseController.getTests(req,res));
})

Router.post("/edit/:id", async(req,res)=>{
   res.send(await CourseController.updateCourse(req,res));
})

Router.delete("/delete/:id",async(req,res)=>{
   res.send(await CourseController.deleteCourse(req,res));
})

Router.post("/addQuestion/:id",async(req,res)=>{
    res.send(await CourseController.AddQuestionToCourses(req,res));
})



///Questions 

// Router.get("/:id/question/:questionId",async(req,res)=>{
//   res.send(await QuesionController.getById(req,res))  
// })

// Router.post("/edit/:id/question/:questionId", async(req,res)=>{
//     res.send(await QuesionController.updateQuestion(req,res));
//  })
 
//  Router.delete("/delete/:id/question/:questionId",async(req,res)=>{
//     res.send(await QuesionController.deleteQuestion(req,res));
//  })

module.exports = Router  