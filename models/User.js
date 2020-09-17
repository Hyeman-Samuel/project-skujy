const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');

const UserSchema=new Mongoose.Schema({
"Username":{type:String,required:true},
"Password":{type:String,required:true},
"Role":{type:String,required:true}
})
const Users= Mongoose.model('User',UserSchema);

module.exports={
    Users
}