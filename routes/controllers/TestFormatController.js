const {TestFormat,QuestionSelectionType} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");
const {Attempt}= require("../../models/Attempt")
const {Logger} = require("../../utility/Logger");
const {paginateArray} = require("../../utility/Pagination");

async function createTestFormat(req,res){      
 try{   
     if(req.body.SelectedQuestions != ""){
     req.body.SelectedQuestions = JSON.parse(req.body.SelectedQuestions)
    }
    const test = new TestFormat(req.body);
    const course = await Course.findById(req.params.id).populate(["Questions","Tests"]);
    if(course == null){
        return {message:"Course Not Found",code:0}
    }

    switch (test.QuestionSelection) {
        case QuestionSelectionType.AllQuestions:
        if(course.Questions.length < test.NumberOfQuestions){
            return {message:"Not enough Questions ",code:-1}
        }    
            break;
        case QuestionSelectionType.SelectedQuestions:
        if(test.SelectedQuestions < test.NumberOfQuestions){
            return {message:"Not enough Questions ",code:-1}
        }              
            break;
        default:
            if(course.Questions.length < test.NumberOfQuestions){
                return {message:"Not enough Questions ",code:-1}
            }
            break;
    }
    test.Course = course._id
    test.TestCode = generateCode(6)
    await test.save()
    return {message:"Test Created",code:1, data:{"test":test,"course":course} }; 
    }catch(err){
    Logger.error(err.message,err)
     return {message:err._message,code:-1} 
      }
}


async function getAllTests(obj){
    try {
        const testFormat = await TestFormat.find(obj).populate(["Course"]).lean()
        if(testFormat == null){
            return {message:"Test(s) Not Found",code:0, };    
        }
        return {message:"Test(s) Found",code:1, data:testFormat }; 
        
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    }
}



async function getById(req,res){
    try {
        const testFormat = await TestFormat.findById(req.params.id).populate(["Course","SelectedQuestions"]).lean()
        var paginationObj = paginateArray(req.query.Qpage,testFormat.SelectedQuestions,13)
        var traverser = paginationObj.ArrayTraverser
        const Questions = testFormat.SelectedQuestions.slice(traverser.start,traverser.end)
        if(testFormat == null){
            return {message:"Test(s) Not Found",code:0, };    
        }
        return {message:"Test(s) Found",code:1, data:{"testFormat":testFormat,"Questions":Questions,"QuestionPagination":paginationObj} }; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    }    
  }

  async function getAttempts(req,res){
    try {
        const attempts = await Attempt.find({"Test":req.params.id}).populate(["QuestionsAttempted.question"]).lean()
        if(attempts.length == 0){
            return {message:"No Attempts(s) Found",code:1}; 
        }
        return {message:"Attempts(s) Found",code:1, data:attempts }; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1}
    } 

  }



async function closeTest(req,res){ 
    try {
    const test = await TestFormat.findById(req.params.testId);
    test.IsClosed = true;
    
        await test.save()
        return {message:"Test Closed",code:1}; 
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1} 
    }
}

async function openTest(req,res){ 
   try { 
       const test = await TestFormat.findById(req.params.testId);
        test.IsClosed = false;
    
        await test.save()
        return {message:"Test Opened",code:1};
    } catch (err) {
        Logger.error(err.message,err)
        return {message:err._message,code:-1} 
    }
}

async function deleteTest(req,res) {
    try{
    const test = await TestFormat.findByIdAndDelete(req.params.testId);
    await Attempt.deleteMany({"Test":req.params.testId})
    return {message:"Test Deleted",code:1,data:test};
    }catch{
    Logger.error(err.message,err)
    return {message:"UnSuccessful",code:-1}
    }
}

function generateCode(digits) {  
    var numbers = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < digits; i++ ) { 
        OTP += numbers[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

function HandleQuestionSelection(selectionType,Questions){

}

module.exports = {
    createTestFormat,
    closeTest,
    openTest,
    deleteTest,
    getById,
    getAttempts,
    getAllTests
}
