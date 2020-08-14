
const AttemptPublicSchema = {
    "Email":{type:String,required:true},
    "Test":{type:Mongoose.Schema.Types.ObjectId,ref:"TestFormat"}
}