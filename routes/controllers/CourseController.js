const {Course,ValidateCourse} = require("../../models/Course");
const {TestFormat} = require("../../models/TestFormat")
const {paginateModel,paginateArray} = require("../../utility/Pagination");
const QuestionController = require("../controllers/QuestionController");
const TestFormatController=require("../controllers/TestFormatController");

async function createCourse(req,res) {       
    try{
    const course = new Course(req.body);
    await course.save();
    return {message:"Document(s) Created",code:1, data:course};
    }catch(err){
     //logger
     return {message:err,code:-1} 
      }
 }

 async function AddQuestionToCourse(req,res) { 
    const question = await QuestionController.createQuestion(req,res)
    if(question.code == -1){
      return question
    }
    try{
    const course = await Course.findById(req.params.id);
    if(course == null){
      return {message:"Course Not Found",code:0}
    }
    course.Questions.push(question.data.id)  
    await course.save()
    await course.populate(["Questions","Tests"])
    return {message:"Document(s) Added",code:1, data:course};
    }catch(err){
        return {message:err,code:-1,data:course} 
    }
 }


 async function AddTestToCourse(req,res){
  const test = await TestFormatController.createTestFormat(req,res);
  if(test.code != 1){
    return test    
  }
  var course = test.data.course
  course.Tests.push(test.data.test._id)
  try{   
  await course.save();
  await course.populate(["Questions","Tests"])
  return {message:"Test Created",code:1,data:course}; 
  }catch(err){
   //logger
   return {message:err,code:-1} 
    }

 }

 async function getTests(req,res){
   try { 
     const tests = await TestFormat.find({"Course":req.params.id}).lean()
   if(tests != null){
    return {message:"Document(s) Found",code:1, data:tests};
    }else{return {message:"Not Found",code:0}} 
     
   } catch (err) {
    return {message:err,code:-1}
   } 
  }

 async function getCourses(req,res) { 
    const CourseCollection=await Course.find().lean()
    if(CourseCollection.length == 0)return ({message:"No Courses",code:0});
    return {message:"Document(s) Found",code:1, data:CourseCollection};
 }



 async function getById(req,res){
   try {
    const course = await Course.findById(req.params.id).populate(["Questions","Tests","Questions.Options"]).lean()
    if (course != null){
      return {message:"Document(s) Found",code:1, data:course};
    }
   else {return {message:"Not Found",code:0}}    
   } catch (err) {
    return {message:err,code:-1}
   }
  
  }


  async function updateCourse(req,res) {
    try{        
      const course = await Course.findOneAndUpdate({"_id":req.params.id},req.body,{new:true});
      return {message:"Document(s) Updated",code:1, data:course};
    }catch (err){
      return {message:err,code:-1}
    }
  }

  async function deleteCourse(req,res) {
    try{
    const course = await Course.findByIdAndDelete(req.params.id);
    return {message:"Document(s) deleted",code:1, data:course};
    }catch(err){
    return {message:err,code:-1}
    }
}




module.exports = {
     createCourse,
     getCourses,
    updateCourse,
    deleteCourse,
    getById,
    getTests,
    AddQuestionToCourse,
    AddTestToCourse
}