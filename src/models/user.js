const mongoose= require('mongoose');
const validator=require('validator');
const becrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');


const userschema= new mongoose.Schema({
    Name:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        unique:true,
        required:true,
        validate:function(val){
            if(!validator.isEmail(val)){
                throw new Error('Invalid email');
            }
        }

    },
    
    Password:{
        type:String,
        required:true,
        validate:function(val){
            if(!validator.isStrongPassword(val)){
                throw new Error('Password not Strong enough');
            }
        }
    },
    Age:{
        type:Number,
        validate:function(value){
            if(value < 0 ){
               throw new Error("Enter valid Age");
            }
        },
    },
    Tokens:[{
        Token:{
            type:String,
            required:true
            }
    }
        ]
    
},{timestamps:true}
);

userschema.methods.ValidToken = async function(){
    const user =this;
    const tokent = jwt.sign({_id:user._id.toString()},'kskssjsjasj');

    user.Tokens = user.Tokens.concat({Token:tokent});

    await user.save();
    
    return tokent;
}

userschema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
});
userschema.methods.Hide = function(){
    const user = this;
    const userobj =user.toObject();

    delete userobj.Password;
    delete userobj.Tokens;
    return userobj;
};
userschema.statics.CheckCred = async(Email,Password)=>{

    const userr =await User.findOne({Email});
    if(!userr)
    {
        throw new Error("Login Failed");
    }
    const checkpass = await becrypt.compare(Password,userr.Password);
  
    if(!checkpass){
        throw new Error("Login Failed");  
    }
return userr;
}
//delet tasks
userschema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id});
    next()
});

//password
userschema.pre('save' , async function(next){
 const user=this;
    if(user.isModified('Password')){
        const hashedval=await becrypt.hash(user.Password,8);
        user.Password=hashedval;
     
    }
  
    
    next()
});

const User=mongoose.model('User' , userschema);

module.exports=User;