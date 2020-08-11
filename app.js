const Express= require('express');
const useMongoDB = require("./startup/useMongoDB");
const useParser = require("./startup/useParser");

//Routes
const questions = require("./routes/QuestionRoute")
const app =Express();
app.use(Express.json());


app.set('port', process.env.PORT || 3000)
useParser(app)
useMongoDB();


app.use("/questions",questions)


app.get('/',(req,res)=>{
    res.send("home");
  })



app.listen(app.get('port'), function() {
    console.log(`server listening on port ${app.get('port')}`)
  });