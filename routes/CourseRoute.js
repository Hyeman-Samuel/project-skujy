const express = require('express');
const Router = express.Router();
const ValidateCourse = require("../public_models/PublicCourse")
const CourseController = require("./controllers/CourseController");
const ResponseManager = require('../utility/ResponseManager');


Router.post("/",async(req,res)=>{ 
    const {error}=ValidateCourse(req.body);         
    if(error)return res.status(400).send(error.details[0].message);

    var result = await CourseController.createCourse(req,res);
    if(result.code == 1){
        res.redirect(`/${result.data.id}`)
    }else{
        res.send("error page");  
    }
})

Router.get("/",async(req,res)=>{
    var result = await CourseController.getCourses(req,res)   
    if(result.code == 1){
        console.log(result.data)
        res.render("layout/admin/courses_page.hbs",{Courses:result.data,})
    }else{
        res.send("error page");  
    }
    
})

Router.get("/:id", async(req,res)=>{
 var result = await CourseController.getById(req,res);
    if(result.code == 1){
        res.render("layout/admin/course_detail.hbs")
    }else{
        res.send("error page");  
    }
})

Router.get("/:id/test",async(req,res)=>{
  var result = await CourseController.getTests(req,res);
  ResponseManager(req,res,result);
})

Router.get("/:id/question",async(req,res)=>{
    var result = await CourseController.getQuestions(req,res);
    ResponseManager(req,res,result);
  })


Router.put("/:id", async(req,res)=>{
    const {error}=ValidateCourse(req.body);         
    if(error)return res.status(400).send(error.details[0].message);  
    
    
   var result = await CourseController.updateCourse(req,res);
    if(result.code == 1){
        res.redirect(`/${result.data.id}`)
    }else{
        res.send("error page");  
    }
})

Router.delete("/:id",async(req,res)=>{
    var result = await CourseController.deleteCourse(req,res)
    if(result.code == 1){
        res.redirect(`/`)
    }else{
        res.send("error page");  
    }
})

Router.post("/:id/addquestion",async(req,res)=>{
    var result = await CourseController.AddQuestionToCourse(req,res);
    if(result.code == 1){
        res.redirect(`/${result.data.id}`)
    }else{
        res.send("error page");  
    }
})

Router.post("/:id/addtest",async(req,res)=>{
    var result = await CourseController.AddTestToCourse(req,res);

    if(result.code == 1){
        res.redirect(`/${result.data.id}`)
    }else{
        res.send("error page");  
    }
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