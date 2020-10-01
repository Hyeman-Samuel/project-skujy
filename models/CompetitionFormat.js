const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');


const CompetitionFormatSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "NumberOfQuestions":{type:Number,required:true},
    "DurationInMinutes":{type:Number,required:true},
    "Course":{type:Mongoose.Schema.Types.ObjectId,ref:"Course",required:true},
    "Trials":{type:Number,default:1},
    "QuestionSelection":{type:Number,default:1},
    "SelectedQuestions":[{type:Mongoose.Schema.Types.ObjectId,ref:"Question"}],
    "Stage":{type:Number,default:1},
    "Price":{type:Number,default:0},
    "Registrations":[{type:Mongoose.Schema.Types.ObjectId,ref:"Entry"}]
})
///For QuestionSelection
const QuestionSelectionType = {
    AllQuestions: 1,
    SelectedQuestions: 2
};
Object.freeze(QuestionSelectionType);

///For Stage
const CompetitionStage = {
    Registration: 1,
    Started: 2,
    Ended: 3
};
Object.freeze(CompetitionStage);



const CompetitionFormat = Mongoose.model('CompetitionFormat',CompetitionFormatSchema);

module.exports = {
    CompetitionFormat,
    QuestionSelectionType,
    CompetitionStage
}