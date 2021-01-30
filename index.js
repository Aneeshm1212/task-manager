const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
const task=require('./src/models/tasks.js');
const Userroute=require('./src/routers/userrouter.js');
const Taskroute=require('./src/routers/taskrouter.js');


app.use(express.json())
app.use(Userroute);
app.use(Taskroute)


app.listen(port,()=>{
console.log('Server up at ',port);
});