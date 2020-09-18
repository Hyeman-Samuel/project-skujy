const express = require('express');
const Router = express.Router();
const CourseController = require("./controllers/CourseController");
const QuestionController = require("./controllers/QuestionController");
const TestController = require("./controllers/TestFormatController")
const ResponseManager = require('../utility/ResponseManager');
const { check, validationResult, body} = require('express-validator');
const { isNull, isNumber } = require('lodash');


Router.post("/",validateCourse(),async(req,res)=>{ 
    var errors = validationResult(req).array()

    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect("/course/add");
        return
    }

    var result = await CourseController.createCourse(req,res);
    if(result.code == 1){
        res.redirect(`course/${result.data.id}`)
    }else{
    }
})




Router.get("/add",async(req,res)=>{
    res.render("layout/admin/forms/course_form.hbs",{"errors":req.session.errors})  
    req.session.errors = null;  
})



Router.get("/",async(req,res)=>{
    var result = await CourseController.getCourses(req,res)   
    if(result.code == 1){
        res.render("layout/admin/courses_page.hbs",{data:result.data})
    }else if(result.code == 0){
        res.render("layout/admin/courses_page.hbs",{Courses:null})  
    }else{
        res.send("error page");
    }    
})




Router.get("/:id", async(req,res)=>{
 var result = await CourseController.getById(req,res);
    if(result.code == 1){
        res.render("layout/admin/course_detail.hbs",{data:result.data})
    }else{
        //res.render("layout/admin/course_detail.hbs")
        res.send("error page: ");  
    }
})

Router.get("/:id/edit", async(req,res)=>{    
    
   var result = await CourseController.getOnlyCourseById(req,res);
    if(result.code == 1){
        res.render("layout/admin/forms/edit_course_form.hbs",{data:{"Course":result.data},"errors":req.session.errors})
        req.session.errors = null;
    }else{
        res.send("error page");  
    }
})



Router.post("/:id/edit",validateCourse(), async(req,res)=>{
    var errors = validationResult(req).array()

    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect(`/course/${req.params.id}/edit`);
        return
    }
    
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
        res.render("layout/admin/forms/question_form.hbs",{"CourseId":CourseId,"errors":req.session.errors})
        req.session.errors = null
    }else{
        res.send("error page");  
    }
})


Router.post("/:id/addquestion",validateQuestion(),async(req,res)=>{
    var errors = validationResult(req).array()
    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect(`/course/${req.params.id}/question`);
        return
    }

    var result = await CourseController.AddQuestionToCourse(req,res);
    if(result.code == -1){
        var error = {msg:result.message,param:""}
        req.session.errors =[error]
        res.redirect(`/course/${req.params.id}/question`)
        return
    }
    if(result.code == 1){
        res.redirect(`/course/${result.data.id}`)
    }else{
        res.send("error page" + result.message);  
    }
})



Router.get("/:id/question/:questionId",async(req,res)=>{
    var courseId = req.params.id;
    var result = await QuestionController.getById(req,res)
    if( result.code == 1){
        res.render("layout/admin/forms/edit_question_form.hbs",{data:{"Question":result.data,"CourseId":courseId},"errors":req.session.errors})
        req.session.errors = null;
    }else{
        res.send("error page");  
    }
})


Router.post("/:id/question/:questionId/edit",validateQuestion(),async(req,res)=>{
    var errors = validationResult(req).array()
    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect(`/course/${req.params.id}/question/${req.params.questionId}`);
        return
    }
    var courseId = req.params.id;
    var result = await QuestionController.updateQuestion(req,res);
    if(result.code == -1){
        console.log(result)
        var error = {msg:result.message,param:""}
        req.session.errors =[error]
        res.redirect(`/course/${req.params.id}/question/${req.params.questionId}`)
        return
    }
    if(result.code == 1){
        res.redirect(`/course/${courseId}`)
    }else{
        res.send("error page" + result.message);  
    }
})








////// Test

Router.get("/:id/test",async(req,res)=>{
    var CourseId = req.params.id
    if(CourseId != null){
        res.render("layout/admin/forms/test_form.hbs",{"CourseId":CourseId,"errors":req.session.errors})
        req.session.errors = null;
    }else{
        res.send("error page");  
    }
})




Router.post("/:id/addtest",validateTest(),async(req,res)=>{
    var errors = validationResult(req).array()
    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect(`/course/${req.params.id}/test`);
        return
    }
    var result = await CourseController.AddTestToCourse(req,res);

    if(result.code == -1){
        var error = {msg:result.message,param:"string"}
        req.session.errors =[error]
        res.redirect(`/course/${req.params.id}/test`)
        return
    }

    if(result.code == 1){
        res.redirect(`/course/${result.data.id}`)
    }else{
        res.send("error page"+result.message);  
    }
})



// Router.get("/:id/test/:testId/edit",async(req,res)=>{
//     var CourseId = req.params.id
//     var result = await TestController.getById(req,res)
//     if(CourseId != null && result.code == 1){
//         res.render("layout/admin/forms/edit_question_form.hbs",{data:{"CourseId":CourseId,"Test":result.data},"errors":req.session.errors})
//         req.session.errors = null;
//     }else{
//         res.send("error page");  
//     }
// })


function  validateTest(){
    return [
        check('Title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
        check('NumberOfQuestions',)
        .not()
        .isEmpty()
        .withMessage('No Questions'),
        check('DurationInMinutes',)
        .not()
        .isEmpty()
        .withMessage(' No Duration'),
        check('Trials',)
        .not()
        .isEmpty()
        .withMessage(' No trials added')     
    ]
}

function validateQuestion(){
    return [
        check('Title')
        .not()
        .isEmpty()
        .withMessage('Title is required')
    ]
}

function validateCourse(){
    return [
        check('Title')
        .not()
        .isEmpty()
        .withMessage('Title is required')
    ]
}





module.exports = Router  