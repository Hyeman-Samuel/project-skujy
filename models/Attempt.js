const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');

const AttemptSchema=new Mongoose.Schema({
    "Email":{type:String,required:true},
    "QuestionsAttempted":[{type:QuestionsAttemptedSchema,required:true}],
    "Score":{type:Number,default:-1},
    "HasSubmitted":{type:Boolean,default:false},
    "CourseId":{type:Number,required:true},
    "TestId":{type:Number,required:true},
    "StartTime":{type:Number,required:true},
    "StopTime":{type:Number,required:true}
})


const QuestionsAttemptedSchema = new Mongoose.Schema({
    "QuestionId":{type:String,required:true},
    "AnswerPickedIndex":{type:Number,default:-1}
})




