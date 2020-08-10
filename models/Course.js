const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');
const _=require('lodash');

const CourseSchema=new Mongoose.Schema({
    "Title":{type:String,required:true},
    "Question":[{type:Mongoose.Schema.Types.ObjectId,ref:"Question"}]
})

const Course= Mongoose.model('Course',CourseSchema);



async function ValidateCourse(Course){
    const Schema ={
        "Title":Joi.string().required()
    }
}