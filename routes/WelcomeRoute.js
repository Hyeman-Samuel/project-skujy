const express = require('express');
const Router = express.Router();
const TestController = require("./controllers/TestFormatController");


Router.get("/",async(req,res)=>{ 

    var testResult = await TestController.getAllTests({IsClosed:false})
    if(testResult.code == -1){
        //res.send("error page")
        res.sendStatus(500)
    }
    res.render("layout/user/user_index.hbs",{"layout":"user/user_layout.hbs","tests":testResult.data,   "errors":req.session.errors})
    req.session.errors = null
})





module.exports = Router 