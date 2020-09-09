const express = require('express');
const Router = express.Router();
const TestController = require("./controllers/TestFormatController");


Router.get("/",async(req,res)=>{ 

    var result = await TestController.getAllTests({IsClosed:false})
    if(result.code == -1){
        res.send("error page")
    }
    res.render("layout/admin/admin_layout.hbs",{"layout":null,"tests":result.data})
})


module.exports = Router 