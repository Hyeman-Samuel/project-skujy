const Mongoose=require('mongoose');
const config= require("config");
const {Logger} = require("../utility/Logger")

module.exports=function (){
    Mongoose.connect(config.get("MongoDbConnectionString"),{ useNewUrlParser: true }).then(()=>{
    Logger.info("connected to mongoDb")
}).catch((err)=>{
    
    Logger.error("An error occured",err)
    ///No need for process.exit()
})
}