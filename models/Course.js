const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

const CourseSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "Questions":[{type:Mongoose.Schema.Types.ObjectId,ref:"Question"}],
    "Tests":[{type:Mongoose.Schema.Types.ObjectId,ref:'TestFormat'}],
    "Competitions":[{type:Mongoose.Schema.Types.ObjectId,ref:'CompetitionFormat'}]
})

const Course= Mongoose.model('Course',CourseSchema);

module.exports = {
    Course
}