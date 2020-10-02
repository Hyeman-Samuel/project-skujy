const session = require('express-session');


module.exports=function (app){
    app.use(session({
        secret: "MyKey",
        saveUninitialized: false,
        resave: false,
        cookie: {
            expires: 600000
        }
    }));
        
}