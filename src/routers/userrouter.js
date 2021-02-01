const express=require('express');
const router = new express.Router();
const becrypt=require('bcryptjs');
const auth =require('../middleware/auth.js');
require('../databse/mongoosedb.js');
const user=require('../models/user.js');
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Image should be png or jpeg'));
        }
        cb(null,true);
    }

});


router.post('/users',async(req,res)=>{

    const userd =new user(req.body);
 
    try{
     await userd.save();
     const token = await userd.ValidToken();
     res.status(200).send({User:userd.Hide(),token});
    }
    catch(e){
        res.status(400).send(e)
    }
   
 //    userd.save().then((resp)=>{
 //         res.status(201).send(userd);
 //     }).catch((err)=>{
 //         res.status(400);
 //         res.send(err);
 //     }); 
 });

// GET
 router.get('/users/me',auth,async(req,res)=>{
    res.status(200).send(req.user);    
         // user.find({}).then((r)=>{ 
         //     res.send(r)
         // }).catch((e)=>{
         //     res.status(500).send(e);
         // });
     });  
 
    //  router.get('/users/:id',async(req,res)=>{
       
    //      try{
    //          const val = await user.findById(req.params.id);
    //          if(!val)
    //          {
    //              return res.status(404).send('User Not found'); 
    //          }
    //          res.status(201).send(val);
    //         }
    //         catch(e){
    //             res.status(400).send(e)
    //         }
     
         // user.findById(req.params.id).then((value)=>{ 
         //     if(!value)
         //     {
         //       return res.send('User Not found');
         //  }
         //     res.send(value)
         // }).catch((e)=>{
         //     res.status(500).send();
         // });
     
 //    });   
 
 // delete
router.delete('/users/me',auth,async(req,res)=>{
    
    try
    {
        // const val = await user.findByIdAndDelete(req.params.id);
        // if(!val){
        //     return  res.status(404).send("User Not found");
        //  }
        await req.user.remove();
        res.status(200).send("SUCCESSFULLY DELETED");
    }
    catch(e){
        res.status(400).send(e);
    }
    });
    
     //update


    router.patch('/users/me',auth,async(req,res)=>{
        const all=['Name','Age','Email','Password'];
        const valid=Object.keys(req.body);
        const chk=valid.every((val)=> {return all.includes(val)});
        if(!chk){
            return res.status(400).send('Invalid Key');
        }
    try
    {
        const val = await user.findById(req.user._id);
        valid.forEach((one)=>{
            val[one]=req.body[one];
          
        });
        await val.save()
        if(!val){
           return  res.status(404).send("User Not found");
        }
        res.status(200).send(val.Hide());
    }
    catch(e){
        res.status(400).send(e);
    }
    });

//login
    router.post('/users/login',async(req,res)=>{
       try{
        const userr = await user.CheckCred(req.body.Email,req.body.Password);
        const token = await userr.ValidToken();
        res.status(201).send({user:userr.Hide() , token});
       }
       catch(e){
        res.status(400).send("UNSUCCESSFUL");
       }
    });

    router.post('/users/logout',auth,async(req,res)=>{
      try{
       req.user.Tokens =  req.user.Tokens.filter((token)=>{
                return token.Token !== req.token;
        });
       
      // const finish = await user.updateOne({_id:req.user._id,'Tokens.Token':req.token},{Tokens:newone});
      // console.log(finish)
      await req.user.save()
     //  await newone.save()
       res.status(200).send()
     }
    catch(e){
       res.status(500).send(e);
}
});

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
    req.user.Tokens = [];
     await req.user.save();
     res.status(200).send()
    }
    catch(e){
     res.status(500).send();
 }
});

//upload profile

router.post('/users/me/avatar',auth,upload.single('fname'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:200 , height : 300}).png().toBuffer();
    req.user.Avatar = buffer
    await req.user.save()
    res.status(200).send();
},(error,req,res,next)=>{
    
    res.status(400).send({Error:error.message})
});


router.delete('/users/me/avatar',auth,upload.single('fname'),async(req,res)=>{
    
    req.user.Avatar = undefined
    await req.user.save()
    res.status(200).send();
});

router.get('/users/:id/avatar',upload.single('fname'),async(req,res)=>{
    try{
        const ruser =await user.findById(req.params.id);
        if(!ruser  || !ruser.Avatar)
        {
            throw new Error()
        }
        res.set('Content-Type','image/png');
        res.send(ruser.Avatar)
    }
    catch(e)
    {
        res.status(400).send()
    }
});
    module.exports=router;