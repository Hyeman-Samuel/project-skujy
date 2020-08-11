const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');

const AttemptSchema=new Mongoose.Schema({
    "Email":{type:String,required:true},
    "QuestionsAttempted":[{type:OptionSchema}],
    "Score":{type:Number,required:true},
})

    


