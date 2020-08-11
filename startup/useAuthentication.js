const { Users } = require("../models/user");
const Bcrypt = require("bcryptjs");
const config= require("config");
const session=require("express-session");
const config= require("config");

var seeder =async (req, res, next) => {
    const users =await (await Users.find()).length;
    if (users === 0) {
      var SeededUser = new Users({
        Email:config.get("AdminUserEmail"),
        Password: await Bcrypt.hash(config.get("AdminUserPassword"), 10),
        Role: "Admin"
      });
      try {
        SeededUser.save();
      } catch {
        ////SeriousProblem
      }
    }
    next();
  };

  var sessionChecker = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/auth");
    }
  };

module.exports=function (app){
    console.log(config.get("SercetAuthKey"));
    app.use(seeder)
    app.use(session({
        secret: config.get("SercetAuthKey"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 10000000
        }
    }));
}