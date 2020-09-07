const Express= require('express');
const useMongoDB = require("./startup/useMongoDB");
const useParser = require("./startup/useParser");
const useHandlebars = require("./startup/useHandleBars");

const app = Express();
app.use(Express.json());
//Routes
const questions = require("./routes/QuestionRoute")
const course = require("./routes/CourseRoute")
const testFormat= require("./routes/TestFormatRoute")
const attempt = require("./routes/AttemptRoute")
const home = require("./routes/HomeRoute")

app.set('port', process.env.PORT || 3000)
useParser(app)
useMongoDB();
useHandlebars(app,__dirname,Express)


app.use("/question",questions);
app.use("/course",course);
app.use("/test",testFormat);
app.use("/attempt",attempt);


app.get('/',home)



app.listen(app.get('port'), function() {
    console.log(`server listening on port ${app.get('port')}`)
  });