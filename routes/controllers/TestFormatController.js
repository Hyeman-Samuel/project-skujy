const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");
const {Attempt}= require("../../models/Attempt")
const {Logger} = require("../../utility/Logger");

async function createTestFormat(req,res){      
 try{    
    const test = new TestFormat(req.body);
   
    const course = await Course.findById(req.params.id).populate(["Questions","Tests"]);
    if(course == null){
        return {message:"Course Not Found",code:0}
    }
    if(course.Questions.length < test.NumberOfQuestions){
        return {message:"Not enough Questions ",code:-1}
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
        const testFormat = await TestFormat.findById(req.params.id).populate(["Course"]).lean()
        if(testFormat == null){
            return {message:"Test(s) Not Found",code:0, };    
        }
        return {message:"Test(s) Found",code:1, data:testFormat }; 
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

module.exports = {
    createTestFormat,
    closeTest,
    openTest,
    deleteTest,
    getById,
    getAttempts,
    getAllTests
}
