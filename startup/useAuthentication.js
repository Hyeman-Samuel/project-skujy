const { Users } = require("../models/User");
const Bcrypt = require("bcryptjs");
const config= require("config");
const jwt = require("jsonwebtoken");

// config.get("AdminUserEmail")await Bcrypt.hash(config.get("AdminUserPassword"), 10)
var seeder = async (req, res, next) => {
    const users =  (await Users.find().lean()).length
    if (users === 0) {
      var SeededUser = new Users({
        Username:"skuji",
        Password:"mypassword",
        Role: "Admin"
      });
      try {
       await SeededUser.save();
      } catch {
        ////SeriousProblem
        res.sendStatus(403)
      }
    }
    next();
  };

  var TokenChecker = (req, res, next) => {
    const authcookie = req.cookies.authcookie

    jwt.verify(authcookie,"secretKey",(err,data)=>{
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