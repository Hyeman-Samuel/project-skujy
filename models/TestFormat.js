const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');


const TestFormatSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "NumberOfQuestions":{type:Number,required:true},
    "DurationInMinutes":{type:Number,required:true},
    "Course":{type:Mongoose.Schema.Types.ObjectId,ref:"Course",required:true},
    "IsClosed":{type:Boolean,default:false},
    "Trials":{type:Number,default:1},
    "TestCode":{type:String,required:true},
    "QuestionSelection":{type:Number,default:1},
    "SelectedQuestions":[{type:Mongoose.Schema.Types.ObjectId,ref:"Question"}]
})

const QuestionSelectionType = {
    AllQuestions: 1,
    SelectedQuestions: 2
 };
 Object.freeze(QuestionSelectionType);

const TestFormat = Mongoose.model('TestFormat',TestFormatSchema);

module.exports = {
    TestFormat,
    QuestionSelectionType
}