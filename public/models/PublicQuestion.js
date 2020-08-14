const QuestionPublicSchema = {
    "Title":{type:String,required:true},
    "Options":[{
        "Title":{type:String,required:true},
        "IsCorrect":{type:Boolean,default:false}
    }]
}