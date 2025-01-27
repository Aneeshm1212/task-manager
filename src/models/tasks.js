const mongoose= require('mongoose');


const taskschema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        trim:true

    },
    Desc:{
        type:String,
        required:true,
        trim:true
    },
    
  
   Completed:{
    type:Boolean,
    required:true,
    trim:true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps:true});

const Task=mongoose.model('Tasks' ,taskschema );

module.exports=Task;