const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');


const TestFormatSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "NumberOfQuestions":{type:Number,required:true},
    "Duration":{type:String,required:true},
    "Course":{type:Mongoose.Schema.Types.ObjectId,ref:"Course",required:true},
    "IsClosed":{type:Boolean,default:false}
})

const TestFormat = Mongoose.model('TestFormat',TestFormatSchema);



async function ValidateTestFormat(Course){
    const Schema ={
        "Title":Joi.string().required(),
        "QuestionNumber":Joi.string.required()
    }
}

module.exports = {
    TestFormat,
    ValidateTestFormat
}