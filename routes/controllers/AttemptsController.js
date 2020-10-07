const {Attempt} = require("../../models/Attempt");
const {TestFormat,QuestionSelectionType} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");
const {paginateArray}=require("../../utility/Pagination");
const Question = require("../../models/Question");
const {Logger} = require("../../utility/Logger");

async function createTestAttempt(req,res) { 

    const attempt = new Attempt(req.body);
    try { 
        const test = await TestFormat.findById(attempt.Test).populate(["Course"])
    if(test == null){
        return {message:"Test not Found",code:-1}
    }

    if(req.body.TestCode != test.TestCode){
        return {message:"Access Code Invalid",code:-1}
    }
    const attempts = await Attempt.find({"Test":test.id,"Email":req.body.Email}).lean()
    if(attempts.length >= test.Trials){
        return {message:"Maximum attempts reached in this test",code:-1}
    }
    const course  = await Course.findById(test.Course).populate(["Questions"])
    if(course == null){
        return {message:"course not Found",code:-1}
    } 
    
    if(test.IsClosed){
        return {message:"Test is already closed",code:-1}
    }  
    var timeStamp = (new Date()).getTime();
    var Duration = test.DurationInMinutes;
    var DurationInTimeStamp = Duration*1000*60;
    var StopTime = (new Date(timeStamp + DurationInTimeStamp)).getTime();
    attempt.StartTime = timeStamp.toString();
    attempt.StopTime = StopTime.toString();
    attempt.CourseTitle = course.Title;

    var questions = []
    switch (test.QuestionSelection) {
        case QuestionSelectionType.AllQuestions:
            questions = getRandomItemsFromArray(course.Questions,test.NumberOfQuestions);
            break;
        case QuestionSelectionType.SelectedQuestions:
            questions = getRandomItemsFromArray(test.SelectedQuestions,test.NumberOfQuestions);
            break;    
        default:
            questions = getRandomItemsFromArray(course.Questions,test.NumberOfQuestions);
            break;
    }
     
    questions.forEach((item)=>{
        const question = {        
            "question":item
        }
        attempt.QuestionsAttempted.push(question)
    })  
        await attempt.save()
        const NewAttempt = await Attempt.findById(attempt.id).populate({
            path:"QuestionsAttempted.question"
           })
        return {message:"Attempt Started",code:1, data:NewAttempt };      
    } catch (err) {
        Logger.error(err.message,err)
        return {message:"Something Went Wrong with the Question(s):"+err+"Check if Your using it properly",code:-1}       
    }
   
}

async function getAttempt(req,res){
        try {
            var attempt = await Attempt.findById(req.params.attemptId).populate({
            path:"QuestionsAttempted.question"   
            }).lean()
            if(attempt == null){
            return {message:"Attempt Not Found",code:0};
            }
            var questionsAttempted = attempt.QuestionsAttempted
           if (!Array.isArray(questionsAttempted)){
            return {message:"retry",code:-1}
           }
            var paginationObj = paginateArray(req.query.page,questionsAttempted,4)
            var traverser = paginationObj.NumberPerPage*(paginationObj.Page-1)
            var traverserEnd = (traverser+paginationObj.NumberPerPage)
            var Questions =questionsAttempted.slice(traverser,traverserEnd);
            return {message:"Attempt Found",code:1,data:{"attempt":attempt,"questions":Questions,"pagination":paginationObj}}
        } catch (err) {
            Logger.error(err.message,err)
            return {message:err,code:-1}
        }
}


async function getAttempts(req,obj){
    try {
        const attempts = await Attempt.find(obj).lean()
        if(attempts.length == 0){
            return {message:"None",code:0}
        }
        var AttemptPaginationObj = paginateArray(req.query.page,attempts,10)
        var traverser = AttemptPaginationObj.ArrayTraverser
        const PaginatedAttempts = attempts.slice(traverser.start,traverser.end)
        
        return {message:"Sent",code:1,data:{attempts:attempts,"AttemptPagination":AttemptPaginationObj,"Attempts":PaginatedAttempts}}
    } catch (err) {
        Logger.error(ex.message,ex)
        return {message:err,code:-1}
    }
}

async function submitBatchOfAttempts(req,res){

    if(req.body.QuestionsAttempted == undefined){
        req.body.QuestionsAttempted = []
    }

    var questionsAttempted = req.body.QuestionsAttempted;
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate({
            path:"QuestionsAttempted.question"
           }) 
           if(attempt.HasSubmitted == true){
            return {message:"Already Submitted",code:-1 }; 
           }
        attempt.QuestionsAttempted.forEach((prevAttempt)=>{
            questionsAttempted.forEach((nextAttempt)=>{
                if(prevAttempt.question.id == nextAttempt.question){
                    if(nextAttempt.AnswerPickedIndex != null){
                    prevAttempt.AnswerPickedIndex = nextAttempt.AnswerPickedIndex
                }
            }
            })
           })
        attempt.save()
        return {message:"Batch Editied",code:1, data:attempt };      
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err,code:-1} 
    }
}


async function submitAttempt(req,res){
  try {  
      if(req.body.QuestionsAttempted == undefined){
        req.body.QuestionsAttempted = []
    }
    var questionsAttempted = req.body.QuestionsAttempted;
    
        const attempt = await Attempt.findById(req.params.attemptId).populate({
            path:"QuestionsAttempted.question"
           })
           if(attempt.HasSubmitted == true){
            return {message:"Already Submitted",code:-1}; 
           }
        attempt.QuestionsAttempted.forEach((prevAttempt)=>{
            questionsAttempted.forEach((newAttempt)=>{
                if(prevAttempt.question.id == newAttempt.question){
                    prevAttempt.AnswerPickedIndex = newAttempt.AnswerPickedIndex
                }
            })
           })
        attempt.HasSubmitted = true;
        attempt.Score = getScore(attempt.QuestionsAttempted)
        await attempt.save()
        const FinishedAttempt = await Attempt.findById(attempt.id).populate([
        "QuestionsAttempted.question","Test","Test.Course"
        ]).lean()
        return {message:"Attempt Submitted",code:1, data:FinishedAttempt };      
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err,code:-1} 
    }
   
}

function getScore(questionsAttempted){
    var score = 0;
    questionsAttempted.forEach((question)=>{

        if(question.question.CorrectOptionIndex == question.AnswerPickedIndex){
           score++ 
        }
    })
    return score;
}

function getRandomItemsFromArray(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }


module.exports = {
    createTestAttempt,
    submitAttempt,
    submitBatchOfAttempts,
    getAttempt,
    getAttempts
}
