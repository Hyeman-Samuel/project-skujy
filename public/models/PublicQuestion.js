const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

    const QuestionPublicSchema = {
        "Title":{type:String,required:true},
        "Options":[{
            "Title":{type:String,required:true},
            "IsCorrect":{type:Boolean,default:false}
        }]
    }


    async function ValidateQuestion(Question){
        let options = Joi.object().keys({
            "Title": Joi.string().required(),
            "IsCorrect" : Joi.bool().required()
          })

        const Schema ={
            "Title":Joi.string().required(),
            "Options":options
        }
        return Joi.validate(Question,Schema)
    }


    module.exports = ValidateQuestion