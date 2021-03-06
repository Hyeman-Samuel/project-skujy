const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');


    const TestFormatPublicSchema ={
        "Title":{type:String,required:true},
        "NumberOfQuestions":{type:Number,required:true},
        "DurationInMinutes":{type:String,required:true},
        "Trials": {type:Number,required:true}
    }



    async function ValidateTestFormat(TestFormat){
        const Schema ={
            "Title":Joi.string().required(),
            "NumberOfQuestions":Joi.number().required(),
            "DurationInMinutes":Joi.number().required(),
            "Trials":Joi.number().required()
        }

        return Joi.validate(TestFormat,Schema)
    }


    module.exports = ValidateTestFormat
