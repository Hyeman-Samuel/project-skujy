const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');


const TestFormatSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "Question":[{type:OptionSchema}],
    "CorrectOptionIndex":{type:Number,required:true}
})