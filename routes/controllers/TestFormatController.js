const {TestFormat,ValidateTestFormat} = require("../../models/TestFormat");


async function createTestFormat(req,res){  
    const {error}=ValidateTestFormat(req.body);         
    if(error)return res.status(400).send(error.details[0].message);     
    try{
    const test = new TestFormat(req.body);
    await test.save();
    return test
    }catch(err){
     //logger
     return {message:err,code:-1} 
      }
}


async function closeTest(req,res){ 
    const test = TestFormat.findById(req.params.testId);
    test.IsClosed = true;
    try {
        await test.save()
    } catch (err) {
        return {message:err,code:-1} 
    }
}


async function deleteTest(req,res) {
    try{
    const test = await TestFormat.findByIdAndDelete(req.params.testid);
    return test;
    }catch{
    return -1
    }
}

module.exports = {
    createTestFormat,
    closeTest,
    deleteTest
}
