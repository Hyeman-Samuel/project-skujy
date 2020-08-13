const {Course,ValidateCourse} = require("../../models/Course");
const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat")
const {paginateModel,paginateArray} = require("../../utility/Pagination");
const QuestionController = require("../controllers/QuestionController");
const { func } = require("joi");

async function createCourse(req,res) { 
    const {error}=ValidateCourse(req.body);         
    if(error)return res.status(400).send(error.details[0].message);
       
    try{
    const course = new Course(req.body);
    await course.save();
    return course
    }catch(err){
     //logger
     return {message:err,code:-1} 
      }
 }

 async function AddQuestionToCourses(req,res) { 
    const question = await QuestionController.createQuestion(req,res)
    const course = await Course.findById(req.params.id);
    course.questions.push(question._id)
    try{
    await course.save()
    }catch{
        return -1 
    }
 }

 async function getTests(req,res){
   const tests = await TestFormat.find({"Course":req.params.id}).lean()
   return tests;
   }

 async function getCourses(req,res) { 
    const CourseCollection=await Course.find().lean()
    if(CourseCollection.length == 0)return ("No Courses");
    return CourseCollection
 }



 async function getById(req,res){
    const course = await Course.findById(req.params.id).populate(["Questions"]).lean()
    return course
  }


  async function updateCourse(req,res) {
    try{        
      const course = await Course.findOneAndUpdate({"_id":req.params.id},req.body,{new:true});
      return course;
    }catch{
      
    }
  }

  async function deleteCourse(req,res) {
    try{
    const course = await Course.findByIdAndDelete(req.params.id);
    return course;
    }catch{
    return -1
    }
}




module.exports = {
     createCourse,
     getCourses,
    updateCourse,
    deleteCourse,
    getById,
    getTests
}