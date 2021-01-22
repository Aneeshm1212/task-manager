const mongoose= require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/Task-manager',{ useCreateIndex:true,
useNewUrlParser:true});


