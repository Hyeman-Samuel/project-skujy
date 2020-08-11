const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');

const QuestionSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "Question":[{type:OptionSchema}]
})

const OptionSchema = new Mongoose.Schema({
    "Title":{type:String,required:true},
    "IsCorrect":{type:Boolean,required:true}
})

const Question = Mongoose.model('Question',QuestionSchema);



async function ValidateQuestion(Course){
    const Schema ={
        "Title":Joi.string().required()
    }
}