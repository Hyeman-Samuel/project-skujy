const {Question,ValidateQuestion} = require("../../models/Question");
const {Attempt} = require("../../models/Attempt");
const {Course} = require("../../models/Course");
const {TestFormat} = require("../../models/TestFormat");
const {paginateModel,paginateArray} = require("../../utility/Pagination");


async function createQuestion(req,res) {        
    try{
    const question = new Question(req.body);
    const isSet = setCorrectOptionIndex(question)
    if(isSet != null){
        return isSet 
    }    
    await question.save();
    return {message:"Document(s) Created",code:1, data:question}; 
      }catch(err){
     //logger
     return {message:err,code:-1} 
      }
  }





  function setIndex(question){    
    question.Options.forEach((element,index) => {
      question.Options[index].Index  = index  
    });
  }


  function setCorrectOptionIndex(question){
    setIndex(question)
    const correctOption = question.Options.filter(function(item){
        return item.IsCorrect == true
        })

        if (correctOption.length > 1){
         return {message:"Multiple Correct Options",code:-1}
        }else  if (correctOption.length  == 0){
          return {message:"No Correct Options",code:-1}
        }else if (correctOption.length == 1){
          question.CorrectOptionIndex = correctOption[0].Index
        }else{
          return {message:"Unexpected Error",code:-1}
        }
  }




  async function getQuestions(req,res){
    try {
        const QuestionCollection=await Question.find().lean()
        var paginationObj = paginateArray(req.query.page,CourseCollection,13)
        var traverser = paginationObj.ArrayTraverser
        const Questions = QuestionCollection.slice(traverser.start,traverser.end)
        if(!QuestionCollection)return {message:"No Questions",code:0};     
        return {message:"Document(s) Founded",code:1, data:{"Questions":Questions,"Pagination":paginationObj}};      
    } catch (err) {
        return {message:err,code:-1}
    } 
  }

  async function getById(req,res){
    try {
      const question = await Question.findById(req.params.questionId)
      if(question != null){
      return {message:"Document(s) Founded",code:1, data:question};
      }
      return {message:"Document(s) Not Found",code:0};
      
    } catch (err) {
      return {message:err,code:-1};
    }
   
  }
  

  async function updateQuestion(req,res) {
    try{
        const isSet = setCorrectOptionIndex(req.body)
        if (isSet == -1){
            return -1
        }                
      const question = await Question.findOneAndUpdate({"_id":req.params.questionId},req.body,{new:true});
      return question;
    }catch (err){
       return {message:err,code:-1}
    }
  }

  
    async function deleteQuestion(req,res) {
        try{
          const attempts = await Attempt.find({"QuestionsAttempted.question": req.params.id})

      if (attempts.length == 0){    
        var result = await CompareQuestionCountWithTests(req.params.id)
          if (result != null) {
            return result
          }
          const question = await Question.findByIdAndDelete(req.params.id);
          return {message:"Document(s) Deleted",code:1}
        }else{
          return {message:"This Question has already been attempted and cannot be deleted,Delete the Test(s) and Attempt(s) associated with this Question",code: -1}
        }        
        }catch{
        //logger
        }
    }
    
  async function CompareQuestionCountWithTests(questionId){
    var response = null
          const course = await Course.findOne({"Questions":questionId}).populate(["Questions"]).lean()
          const questionCount = course.Questions.length
          const testFormat = await TestFormat.find({"Course":course._id}).lean()
          testFormat.forEach(test => {
            if(questionCount <= test.NumberOfQuestions){
              response = {message:"Not Enough Questions for test(s)",code:-1}
            }
          });
          return response
    }

    module.exports={       
            createQuestion,
            getQuestions,
            updateQuestion,
            deleteQuestion,
            getById       
    }
  
  