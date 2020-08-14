const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');


    const TestFormatPublicSchema ={
        "Title":{type:String,required:true},
        "NumberOfQuestions":{type:Number,required:true},
        "DurationInMinutes":{type:String,required:true},
        "Course":{type:Mongoose.Schema.Types.ObjectId,ref:"Course",required:true}
    }



    async function ValidateTestFormat(TestFormat){
        const Schema ={
            "Title":Joi.string().required(),
            "NumberOfQuestions":Joi.number().required(),
            "DurationInMinutes":Joi.number().required(),
            "Course":Joi.objectId().required()       
        }

        return Joi.validate(TestFormat,Schema)
    }


    module.exports = ValidateTestFormat
