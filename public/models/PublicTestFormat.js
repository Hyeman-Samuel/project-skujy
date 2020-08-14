const TestFormatPublicSchema ={
    "Title":{type:String,required:true},
    "NumberOfQuestions":{type:Number,required:true},
    "DurationInMinutes":{type:String,required:true},
    "Course":{type:Mongoose.Schema.Types.ObjectId,ref:"Course",required:true}
}