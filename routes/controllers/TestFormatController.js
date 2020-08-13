const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat");
const {Course} = require("../../models/Course");

async function createTestFormat(req,res){  
    const {error}=ValidateTestFormat(req.body);         
    if(error)return res.status(400).send(error.details[0].message);     
    try{
    const test = new TestFormat(req.body);
    const course = await Course.findById(test.Course).populate(["Questions"]).lean();
    if(course.Questions.length < test.NumberOfQuestions){
        return {message:"Not enough Questions ",code:-1}
    }
    await test.save();
    return test
    }catch(err){
     //logger
     console.log(err)
     return {message:err,code:-1} 
      }
}


    async function getById(req,res){
    const testFormat = await TestFormat.findById(req.params.testId).populate(["Course"]).lean()
    return testFormat;
  }



async function closeTest(req,res){ 
    const test = await TestFormat.findById(req.params.testId);
    test.IsClosed = true;
    try {
        await test.save()
    } catch (err) {
        return {message:err,code:-1} 
    }
}

async function openTest(req,res){ 
    const test = await TestFormat.findById(req.params.testId);
    test.IsClosed = false;
    try {
        await test.save()
    } catch (err) {
        return {message:err,code:-1} 
    }
}

async function deleteTest(req,res) {
    try{
    const test = await TestFormat.findByIdAndDelete(req.params.testId);
    return test;
    }catch{
    return {message:"UnSuccessful",code:-1}
    }
}

module.exports = {
    createTestFormat,
    closeTest,
    openTest,
    deleteTest,
    getById
}
