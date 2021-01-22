const express=require('express');
const router = new express.Router();
const becrypt=require('bcryptjs');
require('../databse/mongoosedb.js');
const user=require('../models/user.js');

router.post('/users',async(req,res)=>{

    const userd =new user(req.body);
 
    try{
     await userd.save();
     res.status(201).send(userd);
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
 router.get('/users',async(req,res)=>{
     
     try{
         const val = await user.find({})
         res.status(201).send(val);
        }
        catch(e){
            res.status(400).send(e)
        }
         // user.find({}).then((r)=>{ 
         //     res.send(r)
         // }).catch((e)=>{
         //     res.status(500).send(e);
         // });
     });  
 
     router.get('/users/:id',async(req,res)=>{
       
         try{
             const val = await user.findById(req.params.id);
             if(!val)
             {
                 return res.status(404).send('User Not found'); 
             }
             res.status(201).send(val);
            }
            catch(e){
                res.status(400).send(e)
            }
     
         // user.findById(req.params.id).then((value)=>{ 
         //     if(!value)
         //     {
         //       return res.send('User Not found');
         //  }
         //     res.send(value)
         // }).catch((e)=>{
         //     res.status(500).send();
         // });
     
     });   
 
router.delete('/users/:id',async(req,res)=>{
    
    try
    {
        const val = await user.findByIdAndDelete(req.params.id);
        if(!val){
            return  res.status(404).send("User Not found");
         }
        res.status(200).send("SUCCESSFULLY DELETED");
    }
    catch(e){
        res.status(400).send(e);
    }
    });
    



    router.patch('/users/:id',async(req,res)=>{
        const all=['Name','Age','Email','Password'];
        const valid=Object.keys(req.body);
        const chk=valid.every((val)=> {return all.includes(val)});
        if(!chk){
            return res.status(400).send('Invalid Key');
        }
    try
    {
        const val = await user.findById(req.params.id);
        valid.forEach((one)=>{
            val[one]=req.body[one];
          
        });
        await val.save()
        if(!val){
           return  res.status(404).send("User Not found");
        }
        res.status(200).send(val);
    }
    catch(e){
        res.status(400).send(e);
    }
    });


    router.post('/users/login',async(req,res)=>{
       try{
        const userr = await user.CheckCred(req.body.Email,req.body.Password);
        res.status(201).send("SUCCESSFUL");
       }
       catch(e){
        res.status(400).send("UNSUCCESSFUL");
       }
    });
    module.exports=router;