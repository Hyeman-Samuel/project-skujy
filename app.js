const Express= require('express');
const useMongoDB = require("./startup/useMongoDB");
const useParser = require("./startup/useParser");
const useHandlebars = require("./startup/useHandleBars");
const useSession = require("./startup/useSession");
const {sessionCheck,seedUser} = require('./startup/useAuthentication')

const app = Express();
app.use(Express.json());
//Routes
const questions = require("./routes/QuestionRoute")
const course = require("./routes/CourseRoute")
const testFormat= require("./routes/TestFormatRoute")
const attempt = require("./routes/AttemptRoute")
const home = require("./routes/HomeRoute")
const admin = require("./routes/AdminRoute")
const auth = require("./routes/AuthRoute")

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



app.listen(app.get('port'), function() {
    console.log(`server listening on port ${app.get('port')}`)
  });