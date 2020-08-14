const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

    const CourseSchema = {
        "Title":{type:String,required:true}
    }


    async function ValidateCourse(Course){
        const Schema ={
            "Title":Joi.string().required()
        }
       return Joi.validate(Course,Schema)
    }


    module.exports = ValidateCourse