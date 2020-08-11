const Mongoose=require('mongoose');
const config= require("config");
module.exports=function (){
    Mongoose.connect(config.get("MongoDbConnectionString"),{ useNewUrlParser: true }).then(()=>{
////Database Connected 
console.log("connected");
}).catch((err)=>{
    ///End the application
    console.log('error occured : ',err);
    process.exit();
})
}