const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

    ///For Starting
    const AttemptPublicSchema = {
        "Email":{type:String,required:true},
        "Test":{type:Mongoose.Schema.Types.ObjectId,ref:"TestFormat"}
    }


    async function ValidateAttempt(Attempt){
        const Schema ={
            "Email":Joi.string.required(),
            "Test":Joi.objectId().required()
        }

        return Joi.validate(Attempt,Schema)
    }

    ///For Submit

    const SubmitAttemptPublicSchema = {
        "QuestionsAttempted":[{
            "question":{type:Mongoose.Schema.Types.ObjectId,ref:"Question"},
            "AnswerPickedIndex":{type:Number,default:-1}
        }]
    }

    async function ValidateSubmittedAttempt(QuestionsAttempts){
        let Attempts = Joi.object().keys({
            question: Joi.objectId(),
            AnswerPickedIndex : Joi.number()
          })
          let QuestionsAttemptedSchema = Joi.array().items(Attempts)
        return  Joi.validate(QuestionsAttempted,QuestionsAttemptedSchema)
    }




    module.exports = {ValidateAttempt,ValidateSubmittedAttempt}