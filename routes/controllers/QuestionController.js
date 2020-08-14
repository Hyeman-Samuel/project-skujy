const {Question,ValidateQuestion} = require("../../models/Question");
const {Attempt} = require("../../models/Attempt");
const {paginateModel,paginateArray} = require("../../utility/Pagination");


async function createQuestion(req,res) {        
    try{
    const question = new Question(req.body);
    const isSet = setCorrectOptionIndex(question)
    if(isSet != null){
        return isSet 
    }    
    await question.save();
    return question
      }catch(err){
     //logger
     return {message:err,code:-1} 
      }
  }





  function setIndex(question){    
    question.Options.forEach((element,index) => {
      question.Options[index].Index  = index  
      console.log(question.Options[index])
    });
  }


  function setCorrectOptionIndex(question){
    setIndex(question)
    const correctOption = question.Options.filter(function(item){
      console.log(1)
        return item.IsCorrect == true
        })

        if (correctOption.length > 1){
         return {message:"Multiple Correct Options",code:-1}
        }else  if (correctOption.length  == 0){
          return {message:"No Correct Options",code:-1}
        }else if (correctOption.length == 1){
          console.log(correctOption[0].Index)
          question.CorrectOptionIndex = correctOption[0].Index
        }else{
          return {message:"Unexpected Error",code:-1}
        }
  }




  async function getQuestions(req,res){
   // var Pagination=await paginateModel(req.query.page,Question);
   // const QuestionCollection=await Question.find().skip(Pagination.NumberPerPage*CurrentPage).limit(Pagination.NumberPerPage).lean();
   const QuestionCollection=await Question.find().lean()
      if(!QuestionCollection)return ("No Questions");
      //logger
      return QuestionCollection
     // return {QuesionCollection,Paginatio}
      //res.render('admin/cities', );
  }

  async function getById(req,res){
    const question = await Question.findById(req.params.questionId)
      return question
  }
  

  async function updateQuestion(req,res) {
    try{
        const isSet = setCorrectOptionIndex(req.body)
        if (isSet == -1){
            return -1
        }        
        
      const question = await Question.findOneAndUpdate({"_id":req.params.questionId},req.body,{new:true});
      return question;
    }catch{
      //logger
    }
  }

  
    async function deleteQuestion(req,res) {
        try{
          const attempts = Attempt.find({"QuestionsAttempted.question": req.params.questionId})
          console.log(attempts)
        if (attempts == null){         
          const question = await Question.findByIdAndDelete(req.params.questionId);
          return question;
        }else{
          return {message:"This Question has already been attempted and cannot be deleted,Delete the Test(s) and Attempt(s) associated with this Question",code: -1}
        }

        
        }catch{
        //logger
        }
    }
    

    module.exports={       
            createQuestion,
            getQuestions,
            updateQuestion,
            deleteQuestion,
            getById       
    }
  
  