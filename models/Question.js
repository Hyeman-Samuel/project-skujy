const Mongoose=require('mongoose');

const OptionSchema = new Mongoose.Schema({
    "Title":{type:String,required:true},
    "IsCorrect":{type:Boolean,default:false},
    "Index":{type:Number,required:true}
})

const QuestionSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "Options":[{type:OptionSchema}],
    "CorrectOptionIndex":{type:Number,required:true}
})

const Question = Mongoose.model('Question',QuestionSchema);

module.exports={
    Question
}