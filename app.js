const Express= require('express');
const useMongoDB = require("./startup/useMongoDB");
const useParser = require("./startup/useParser");
const useHandlebars = require("./startup/useHandleBars");
const useSession = require("./startup/useSession");
const {sessionCheck,seedUser} = require('./startup/useAuthentication')
const {Logger} = require("./utility/Logger")
const errorMiddleware = require("./middleware/exception_middleware")
require('express-async-errors');



//Routes
const questions = require("./routes/QuestionRoute")
const course = require("./routes/CourseRoute")
const testFormat= require("./routes/TestFormatRoute")
const attempt = require("./routes/AttemptRoute")
const home = require("./routes/HomeRoute")
const admin = require("./routes/AdminRoute")
const auth = require("./routes/AuthRoute")

if (process.env.NODE_ENV !== 'production') {
 Logger.SetConsoleLogger()
}

process.on('unhandledRejection',(ex)=>{
  Logger.error(ex.message,ex)
})

process.on('uncaughtException',(ex)=>{
  Logger.error(ex.message,ex)
})


const app = Express();
app.use(Express.json());

app.set('port', process.env.PORT || 3000)
useParser(app)
useSession(app)
useMongoDB();
useHandlebars(app,__dirname,Express)

app.use(seedUser)
app.use("/question",sessionCheck,questions);
app.use("/course",sessionCheck,course);
app.use("/test",sessionCheck,testFormat);
app.use("/attempt",attempt);
app.use("/admin",sessionCheck,admin);
app.use("/auth",auth)

app.get('/',home)

app.get("/errorlogs",sessionCheck,async (req,res,)=>{
  res.sendFile(`${__dirname}/error.log`)
})
app.use(errorMiddleware)

app.listen(app.get('port'), function() {
  Logger.info(`server listening on port ${app.get('port')}`)
  });