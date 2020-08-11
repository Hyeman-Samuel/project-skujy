const Mongoose=require('mongoose');
const config= require("config");
module.exports=function (){
    Mongoose.connect('mongodb://heroku_0fw3k0vv:rrmh3ob244e88pc2en8nn1lsjq@ds145365.mlab.com:45365/heroku_0fw3k0vv',{ useNewUrlParser: true }).then(()=>{
////Database Connected 
console.log("connected");
}).catch((err)=>{
    ///End the application
    console.log('error occured : ',err);
    process.exit();
})
}