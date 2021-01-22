const mongoose= require('mongoose');
const validator=require('validator');
const becrypt=require('bcryptjs');

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
    }
});

userschema.statics.CheckCred = async(Email,Password)=>{

    const user =await User.findOne({Email});
    if(!user)
    {
        throw new Error("Login Failed");
    }
    const checkpass = becrypt.compare(Password,User.Password);
    if(!checkpass){
        throw new Error("Login Failed");  
    }
return user;
}

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