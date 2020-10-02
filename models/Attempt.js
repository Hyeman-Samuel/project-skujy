const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

const QuestionsAttemptedSchema = new Mongoose.Schema({
    "question":{type:Mongoose.Schema.Types.ObjectId,ref:"Question"},
    "AnswerPickedIndex":{type:Number,default:-1}
})

const AttemptSchema=new Mongoose.Schema({
    "Email":{type:String,required:true},
    "QuestionsAttempted":[{type:QuestionsAttemptedSchema,required:true}],
    "Score":{type:Number,default:-1},
    "HasSubmitted":{type:Boolean,default:false},
    "Test":{type:Mongoose.Schema.Types.ObjectId,ref:"TestFormat",default:null},
    "Competition":{type:Mongoose.Schema.Types.ObjectId,ref:"CompetitionFormat",default:null},
    "StartTime":{type:String,required:true},
    "StopTime":{type:String,required:true},
    "CourseTitle":{type:String}
})

const Attempt= Mongoose.model('Attempt',AttemptSchema);

module.exports = {
    Attempt
}


