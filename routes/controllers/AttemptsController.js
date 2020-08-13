const {Attempt,ValidateAttempt} = require("../../models/Attempt");
const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");

async function createAttempt(req,res) { 

    const attempt = new Attempt(req.body);
    const test = await TestFormat.findById(attempt.Test).populate(["Course"]).lean()
    const course  = await Course.findById(test.Course).populate(["Questions"]).lean()
    const questions = getRandomItemsFromArray(course.Questions,test.NumberOfQuestions)
    console.log(attempt.QuestionsAttempted)
    questions.forEach((item)=>{
        const question = {        
            "question":item
        }
        attempt.QuestionsAttempted.push(question)
    })
    attempt.StartTime = "Date.now();"
    attempt.StopTime = "attempt.StartTime + test.Duration"
    attempt.CourseTitle = course.Title
    await attempt.save()
    const NewAttempt = await Attempt.findById(attempt.id).populate({
        path:"QuestionsAttempted.question"
       })
    return NewAttempt
}


async function submitAttempt(req,res){
    const attempt = Attempt.findById(req.params.attemptId).lean()
    attempt.HasSubmitted = true;
    attempt.Score = getScore(attempt.QuestionsAttempted)
    return attempt
}


function getScore(questionsAttempted){
////I will write it later!!
    return 0;
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
