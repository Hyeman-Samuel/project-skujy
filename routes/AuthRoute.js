const express = require('express');
const bcrypt =require("bcryptjs");
const Router= express.Router();
const { check, validationResult } = require('express-validator');
const {Users}=require('../models/User');
const jwt = require("jsonwebtoken");

Router.get("/",async(req,res)=>{
res.render('layout/admin/login.hbs',{layout:false,errors:req.session.errors})
req.session.errors = null;
})

Router.post("/login",validateLogin(),async(req,res)=>{
    var errors = validationResult(req).array()

    if(errors.length != 0){
        req.session.errors = errors;
        res.redirect("/auth");
        return
    }
const User = await Users.findOne({"Username":req.body.Username}).lean();
if(!User){
    var error = {msg:"invalid Username",param:""}
    req.session.errors =[error]
     res.redirect("/auth");
     return
}
const IsPassword= await bcrypt.compare(req.body.Password,User.Password);

if(!IsPassword){
    var error = {msg:"invalid Password",param:""}
    req.session.errors =[error]
    res.redirect("/auth")
    return
};

const token = jwt.sign({user:User},'secretKey')
res.cookie('authcookie',token,{maxAge:900000,httpOnly:true}) 

res.redirect('/admin')
})



function validateLogin(){
 return [  check('Username', 'Username is required'),
    check('Password', 'Password is requried')
    .isLength({ min: 1 })
]
}

module.exports = Router