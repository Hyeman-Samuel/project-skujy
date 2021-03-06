const { Users } = require("../models/User");
const Bcrypt = require("bcryptjs");
const config= require("config");
const jwt = require("jsonwebtoken");
const {Logger} = require("../utility/Logger")

// 
var seeder = async (req, res, next) => {
    const users =  (await Users.find().lean()).length
    if (users === 0) {
      var SeededUser = new Users({
        Username:config.get("AdminUserEmail"),
        Password:await Bcrypt.hash(config.get("AdminUserPassword"), 10),
        Role: "Admin"
      });
      try {
       await SeededUser.save();
      } catch(err) {
        ////SeriousProblem
        Logger.error("Failed to seed user",err)
        res.sendStatus(403)
      }
    }
    next();
  };

  var TokenChecker = (req, res, next) => {
    const authcookie = req.cookies.authcookie

    jwt.verify(authcookie,config.get("SecretKey"),(err,data)=>{
     if(err){
      res.redirect("/auth");
     } 
     else if(data.user){
      req.user = data.user
       next()
    }
  })
};


module.exports={
sessionCheck :TokenChecker,
seedUser :seeder
}