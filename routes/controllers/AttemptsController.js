const {Attempt,ValidateAttempt} = require("../../models/Attempt");
const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");

async function createAttempt(req,res) { 

    const attempt = new Attempt(req.body);
    const test = await TestFormat.findById(attempt.Test).populate(["Course"])
    const course  = await Course.findById(test.Course).populate(["Questions"])
    const questions = getRandomItemsFromArray(course.Questions,test.NumberOfQuestions)
    questions.forEach((item)=>{
        const question = {        
            "question":item
        }
        attempt.QuestionsAttempted.push(question)
    })
    var timeStamp = (new Date()).getTime();
    var Duration = test.DurationInMinutes;
    var DurationInTimeStamp = Duration*1000*60;
    var StopTime = new Date(timeStamp + DurationInTimeStamp);
    attempt.StartTime = timeStamp.toString()
    attempt.StopTime = StopTime.toString()
    attempt.CourseTitle = course.Title
    await attempt.save()
    const NewAttempt = await Attempt.findById(attempt.id).populate({
        path:"QuestionsAttempted.question"
       })
    return NewAttempt
}


async function submitAttempt(req,res){
    var questionsAttempted = req.body.QuestionsAttempted;

    const attempt = await Attempt.findById(req.params.attemptId).populate({
        path:"QuestionsAttempted.question"
       }) 
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
    return attempt
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
    submitAttempt
}
