const session = require('express-session');


module.exports=function (app){
    app.use(session({
        secret: 'positronx',
        saveUninitialized: false,
        resave: false
    }));
        
}