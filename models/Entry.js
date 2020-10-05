const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Mongoose=require('mongoose');


const EntrySchema=new Mongoose.Schema({

    "Email":{type:String,required:true},
    "AmountPaid":{type:Number,default:0},
    "ExamNumber":{type:Number,required:true},
    "FullName":{type:String,required:true},
    "Attempt":{type:Mongoose.Schema.Types.ObjectId,ref:'Attempt'},
    "Competition":{type:Mongoose.Schema.Types.ObjectId,ref:'Competition'}
})


const Entry = Mongoose.model('Entry',EntrySchema);

module.exports = {
    Entry
}