const {Course,ValidateCourse} = require("../../models/Course");
const {TestFormat} = require("../../models/TestFormat");
const {Question} = require("../../models/Question");
const {Logger} = require("../../utility/Logger");
const {paginateArray} = require("../../utility/Pagination");
const QuestionController = require("../controllers/QuestionController");
const TestFormatController=require("../controllers/TestFormatController");
const CompetitionController = require("../controllers/CompetitionController");

async function createCourse(req,res) {       
    try{
    const course = new Course(req.body);
    await course.save();
    return {message:"Document(s) Created",code:1, data:course};
    }catch(err){
      Logger.error(err.message,err)
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
      Logger.error(err.message,err)
      return {message:err,code:-1,data:course} 
    }
}


async function getQuestions(req,res) { 
  const course = await Course.findById(req.params.id).populate(["Questions"]).lean()
  if(course == null){
    return {message:"Document(s) Not Found",code:-1}
  }
  var questions = course.Questions
  var questionsInJson = []
  questions.forEach(item => {
    var question = {
      "Title":item.Title,
      "Option0":item.Options[0].Title,
      "Option1":item.Options[1].Title,
      "Option2":item.Options[2].Title,
      "Option3":item.Options[3].Title,
      "Id":item._id
    }
    questionsInJson.push(question)
  });
  return {message:"Document(s)  Found",code:1,data:questionsInJson}
}


async function AddTestToCourse(req,res){
  const test = await TestFormatController.createTestFormat(req,res);
  if(test.code == -1){
    return test    
  }
  var course = test.data.course
  course.Tests.push(test.data.test._id)
  try{   
  await course.save();
  await course.populate(["Questions","Tests"])
  return {message:"Test Created",code:1,data:course}; 
  }catch(err){
    Logger.error(err.message,err)
  return {message:err,code:-1} 
    }
}

async function AddCompetitionToCourse(req,res){
  const competition = await CompetitionController.createCompetitionFormat(req,res)
  if(competition.code == -1){
    return competition   
  }
  var course = competition.data.course
  course.Competitions.push(competition.data.competition._id)
  try{   
  await course.save();
  return {message:"Test Created",code:1,data:course}; 
  }catch(err){
    Logger.error(err.message,err)
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
    Logger.error(err.message,err)
    return {message:err,code:-1}
  } 
  }

async function getCourses(req,res) { 
    const CourseCollection=await Course.find().populate(["Questions","Tests"]).lean()
    var paginationObj = paginateArray(req.query.page,CourseCollection,13)
    var traverser = paginationObj.ArrayTraverser
    var Courses = CourseCollection.slice(traverser.start,traverser.end);
    if(CourseCollection.length == 0)return ({message:"No Courses",code:0});
    return {message:"Document(s) Found",code:1, data:{"Courses":Courses,"Pagination":paginationObj}};
}

async function getOnlyCourseById(req,res){
try{const course = await Course.findById(req.params.id).lean()
  if(course != null){
    return {message:"Found",code:1,data:course}
  }
  return {message:"Not Found",code:0}
}catch (err){
  Logger.error(err.message,err)
  return {message:err,code:-1}
}
}

async function getById(req,res){
  try {
    const course = await Course.findById(req.params.id).populate(["Questions","Tests","Questions.Options","Competitions"]).lean()
    
    if(!Array.isArray(course.Questions) || !Array.isArray(course.Tests)){
      return {message:"Error",code:-1}
    }
    var QuestionpaginationObj = paginateArray(req.query.Qpage,course.Questions,13)
    var Questiontraverser = QuestionpaginationObj.ArrayTraverser
    var Questions = course.Questions.slice(Questiontraverser.start,Questiontraverser.end);
    var TestpaginationObj = paginateArray(req.query.Tpage,course.Tests,13)
    var Testtraverser = TestpaginationObj.ArrayTraverser
    var Tests = course.Tests.slice(Testtraverser.start,Testtraverser.end);
    if(course.Competitions == undefined){
      course.Competitions = []
    }
    var CompetitionpaginationObj = paginateArray(req.query.Cpage,course.Competitions,13)
    var Competitiontraverser = CompetitionpaginationObj.ArrayTraverser   
    var Competitions = course.Competitions.slice(Competitiontraverser.start,Competitiontraverser.end);
    if (course != null){
      return {message:"Document(s) Found",code:1, data:{"Course":course,
                                                        "TestPagination":TestpaginationObj,
                                                        "Tests":Tests,
                                                        "QuestionPagination":QuestionpaginationObj,
                                                        "Questions":Questions,
                                                        "CompetitionPagination":CompetitionpaginationObj,
                                                        "Competitions":Competitions}};
    }
  else {return {message:"Not Found",code:0}}    
  } catch (err) {
    Logger.error(err.message,err)
    return {message:err,code:-1}
  }
  
  }


  async function updateCourse(req,res) {
    try{        
      const course = await Course.findOneAndUpdate({"_id":req.params.id},req.body,{new:true});
      return {message:"Document(s) Updated",code:1, data:course};
    }catch (err){
      Logger.error(err.message,err)
      return {message:err,code:-1}
    }
  }

  async function deleteCourse(req,res) {
    try{  
    const course = await Course.findByIdAndDelete(req.params.id);
    await Question.deleteMany({"_id":{ $in: course.Questions}})
    await TestFormat.deleteMany({"_id":{ $in: course.Tests}})
    
    return {message:"Document(s) deleted",code:1, data:course};
    }catch(err){
      Logger.error(err.message,err)
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
    AddTestToCourse,
    AddCompetitionToCourse,
    getOnlyCourseById,
    getQuestions
}