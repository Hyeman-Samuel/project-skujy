const path =require("path");
const ExpHandleBars=require("express-handlebars");
module.exports=function (app,__dirname,Express){
    app.set('views',path.join(__dirname,'/views/'))
    app.engine("hbs",ExpHandleBars({
        extname:'hbs', 
        defaultLayout : "admin_layout", 
        layoutsDir: path.join(__dirname,'views/layout/admin')
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

    hbs.handlebars.registerHelper("getCount",function(list){
        if(Array.isArray(list)){
            return list.length
        }
    })
}