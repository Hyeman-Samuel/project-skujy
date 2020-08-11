const Express= require('express');



const app =Express();
app.use(Express.json());


app.set('port', process.env.PORT || 3000)

app.get('/',(req,res)=>{
    res.send("home");
  })


app.listen(app.get('port'), function() {
    console.log(`server listening on port ${app.get('port')}`)
  });