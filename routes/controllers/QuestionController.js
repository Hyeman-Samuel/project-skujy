const {Question,ValidateQuestion} = require("../../models/Question");
const {paginateModel,paginateArray} = require("../../utility/Pagination");
const { functions } = require("lodash");

async function createQuestion(req,res) {    
    const {error}=ValidateQuestion(req.body);         
    if(error)return res.status(400).send(error.details[0].message);
   
    
    try{
    const question = new Question(req.body);
    const isSet = setCorrectOptionIndex(req.body)
    if(isSet != -1){
        return -1 
    }
    await question.save();
    return question
      }catch(err){
     //logger
     return {message:err,code:-1} 
      }
  }



  function setCorrectOptionIndex(question){
    const correctOption = question.Options.filter(function(item){
        return item.IsCorrect == true
        })
        if (correctOption.length  != 0){
        question.CorrectOptionIndex = correctOption[0].index
        } else if (correctOption.length > 1){
         return -1
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
    const question = await Question.findById(req.params.id)
      return question
  }
  

  async function updateQuestion(req,res) {
    try{
        const isSet = setCorrectOptionIndex(req.body)
        if (isSet == -1){
            return -1
        }        
        
      const question = await Question.findOneAndUpdate({"_id":req.params.id},req.body,{new:true});
      console.log(question);
      return question;
    }catch{
      //logger
    }
  }

  
    async function deleteQuestion(req,res) {
        try{
        const question = await Question.findByIdAndDelete(req.params.id);
        return question;
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
  
  