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
        res.redirect(`course/${result.data.id}`)
    }else{
        res.send("error page");  
    }
})




Router.get("/add",async(req,res)=>{
    res.render("layout/admin/forms/course_form.hbs")    
})



Router.get("/",async(req,res)=>{
    var result = await CourseController.getCourses(req,res)   
    if(result.code == 1){
        res.render("layout/admin/courses_page.hbs",{Courses:result.data,})
    }else if(result.code == 0){
        res.render("layout/admin/courses_page.hbs",{Courses:null})  
    }else{
        res.send("error page");
    }    
})




Router.get("/:id", async(req,res)=>{
 var result = await CourseController.getById(req,res);
    if(result.code == 1){
        res.render("layout/admin/course_detail.hbs",{Course:result.data})
    }else{
        //res.render("layout/admin/course_detail.hbs")
        res.send("error page");  
    }
})




Router.put("/:id/edit", async(req,res)=>{
    const {error}=ValidateCourse(req.body);         
    if(error)return res.status(400).send(error.details[0].message);  
    
    
   var result = await CourseController.updateCourse(req,res);
    if(result.code == 1){
        res.redirect(`/course/${result.data.id}`)
    }else{
        res.send("error page");  
    }
})


Router.delete("/:id/delete",async(req,res)=>{
    var result = await CourseController.deleteCourse(req,res)
    ResponseManager(req,res,result);
})





////// Question

Router.get("/:id/question",async(req,res)=>{
    var CourseId = req.params.id
    if(CourseId != null){
        res.render("layout/admin/forms/question_form.hbs",{"CourseId":CourseId})
    }else{
        res.send("error page");  
    }
})


Router.post("/:id/addquestion",async(req,res)=>{
    var result = await CourseController.AddQuestionToCourse(req,res);
    if(result.code == 1){
        res.redirect(`/course/${result.data.id}`)
    }else{
        res.send("error page" + result.message);  
    }
})

////// Test

Router.get("/:id/test",async(req,res)=>{
    var CourseId = req.params.id
    if(CourseId != null){
        res.render("layout/admin/forms/test_form.hbs",{"CourseId":CourseId})
    }else{
        res.send("error page");  
    }
})




Router.post("/:id/addtest",async(req,res)=>{
    var result = await CourseController.AddTestToCourse(req,res);

    if(result.code == 1){
        res.redirect(`/course/${result.data.id}`)
    }else{
        res.send("error page"+result.message);  
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

// Router.get("/:id/test",async(req,res)=>{
//   var result = await CourseController.getTests(req,res);
//   ResponseManager(req,res,result);
// })

// Router.get("/:id/question",async(req,res)=>{
//     var result = await CourseController.getQuestions(req,res);
//     ResponseManager(req,res,result);
//   })
module.exports = Router  