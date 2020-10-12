const path =require("path");
const ExpHandleBars=require("express-handlebars");
module.exports=function (app,__dirname,Express){
    app.set('views',path.join(__dirname,'/views/'))
    app.engine("hbs",ExpHandleBars({
        extname:'hbs', 
        defaultLayout : "admin/admin_layout", 
        layoutsDir: path.join(__dirname,'views/layout')
    }));
    app.use("/public",Express.static("public"));
    app.set("view engine","hbs");   

    var hbs = ExpHandleBars.create({});
    hbs.handlebars.registerHelper("IfEqual",(leftSide,rightSide, block)=>{
            if(leftSide==rightSide){
               return block.fn(this)
            }else{
               return  block.inverse(this)
            }
          
    })

    hbs.handlebars.registerHelper("index",function(index){
        var newIndex = index + 1
        return newIndex
})
hbs.handlebars.registerHelper("paginatedIndex",function(index,page,numberPerPage){
    var newIndex = Number(index)+1;
    var pageIndex = page-1;
    var QuestionNumber = (pageIndex * numberPerPage)+newIndex;
    return QuestionNumber;
})
    hbs.handlebars.registerHelper("getCount",function(list){
        if(Array.isArray(list)){
            return list.length
        }
    })
}