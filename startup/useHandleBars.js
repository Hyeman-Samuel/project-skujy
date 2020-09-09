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
}