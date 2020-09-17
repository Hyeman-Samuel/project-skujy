const express = require('express');
const Router = express.Router();
const TestController = require("./controllers/TestFormatController");

Router.get("/admin",async(req,res)=>{
    res.render("admin/admin_index.hbs")
})

Router.get("/",async(req,res)=>{ 

    var result = await TestController.getAllTests({IsClosed:false})
    if(result.code == -1){
        res.send("error page")
    }
    res.render("index.hbs",{"layout":null,"tests":result.data,"errors":req.session.errors})
    req.session.errors = null
})



module.exports = Router 