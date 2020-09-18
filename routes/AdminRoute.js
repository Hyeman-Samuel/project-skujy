const express = require('express');
const Router = express.Router();
const {paginateArray}= require("../utility/Pagination")
const TestFormatController = require("./controllers/TestFormatController")

Router.get("/",async(req,res)=>{
    var result = await TestFormatController.getAllTests({"IsClosed":false})
    if (result.code == 1){
    var paginationObj = paginateArray(req.query.page,result.data,10)
    var traverser = paginationObj.ArrayTraverser
    var Tests = result.data.slice(traverser.start,traverser.end);
    res.render("layout/admin/admin_index.hbs",{data:{"Tests":Tests,"Pagination":paginationObj}})  
    }else if(result.code == 0){
        res.render("layout/admin/admin_index.hbs")  
    }else{
        res.sendStatus(500)
        //res.send("error page")
    }
    
    
})


module.exports = Router