const {Attempt} = require("../../models/Attempt");
const {TestFormat} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");

async function createAttempt(req,res) { 

    const attempt = new Attempt(req.body);
    try { 
        const test = await TestFormat.findById(attempt.Test).populate(["Course"])
    if(test == null){
        return {message:"Test not Found",code:-1}
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

    
    const questions = getRandomItemsFromArray(course.Questions,test.NumberOfQuestions);
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
        return {message:"Something Went Wrong with the Question(s):"+err+"Check if Your using it properly",code:-2}
    }
   
}

async function getAttempt(req,res){
        try {
            var attempt = await Attempt.findById(req.params.attemptId)
            if(attempt == null){
            return {message:"Attempt Not Found",code:0};
            }
            return {message:"Attempt Found",code:1,data:attempt}
        } catch (err) {
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
                    prevAttempt.AnswerPickedIndex = nextAttempt.AnswerPickedIndex
                }
            })
           })
        attempt.save()
        return {message:"Batch Editied",code:1, data:attempt };      
    } catch (err) {
        return {message:err,code:-1} 
    }
}


async function submitAttempt(req,res){
    if(req.body.QuestionsAttempted == undefined){
        req.body.QuestionsAttempted = []
    }
    var questionsAttempted = req.body.QuestionsAttempted;
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate({
            path:"QuestionsAttempted.question"
           }) 
           if(attempt.HasSubmitted == true){
            return {message:"Already Submitted",code:1}; 
           }
        attempt.QuestionsAttempted.forEach((prevAttempt)=>{
            questionsAttempted.forEach((nextAttempt)=>{
                if(prevAttempt.question.id == nextAttempt.question){
                    prevAttempt.AnswerPickedIndex = nextAttempt.AnswerPickedIndex
                }
            })
           })
        attempt.HasSubmitted = true;
        attempt.Score = getScore(attempt.QuestionsAttempted)
        attempt.save()
        return {message:"Attempt Submitted",code:1, data:attempt };      
    } catch (err) {
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
    createAttempt,
    submitAttempt,
    submitBatchOfAttempts,
    getAttempt
}
