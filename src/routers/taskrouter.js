const express=require('express');
const router = new express.Router();
require('../databse/mongoosedb.js');
const task=require('../models/tasks.js');
const auth=require('../middleware/auth.js');

router.post('/tasks',auth,async(req,res)=>{
  //  const tasks =new task(req.body);
const tasks= new task({
   Name:req.body.Name,
   Desc:req.body.Desc,
   Completed:req.body.Completed,
   owner:req.user._id
});
    try{
        await tasks.save();
        res.status(201).send(tasks);
       }
       catch(e){
           res.status(400).send(e)
       }
    // tasks.save().then((resp)=>{
    //      res.send(tasks);
    //  }).catch((err)=>{
    //      res.status(400);
    //      res.send(err);
    //  }); 

});

 router.get('/tasks',auth,async(req,res)=>{
    var sort ={}

     if(req.query.sort)
     {
        var sorted = req.query.sort.split( ':');
        var decide = sorted[1] === 'asec' ? 1 : -1;
        if(sorted[0]==='c')
        {
            sort ={
                createdAt: decide
            }
        }
        else if(sorted[0]==='u'){
            sort ={
                updatedAt: decide
            }
        }
        else if(sorted[0]==='com'){
            sort ={
                Completed: decide
            }
        }
        else{
            sort={}
        }
     }

     
     var options ={
         limit : parseInt(req.query.limit),
         skip : parseInt(req.query.skip) ,
         sort
     };
if(!req.query.completed){
    try{
        
        const val = await task.find({owner:req.user._id},null,options);
                res.status(200).send(val);
         }
       catch(e){
           res.status(400).send(e)
       }
}
else{
  try{
       const match= req.query.completed;
       const val = await task.find({owner:req.user._id,Completed:match},null,options);
               res.status(200).send(val);
        }
      catch(e){
          res.status(400).send(e)
      }}
//     // task.find({}).then((r)=>{ 
//     //     res.send(r)
//     // }).catch((e)=>{
//     //     res.status(500).send(e);
//     // });
 });  

router.get('/tasks/:id',auth,async(req,res)=>{

    try{
        const val = await task.findone({_id:req.params.id,owner:req.user._id});
        console.log(val)
        if(!val)
        {
            return res.status(404).send('Task Not found'); 
        }
        res.status(201).send(val);
       }
       catch(e){
           res.status(400).send(e)
       }

    // task.findById(req.params.id).then((value)=>{ 
    //     if(!value)
    //     {
    //         return res.send('Task Not found');
    //     }
    //     res.send(value)
    // }).catch((e)=>{
    //     res.status(500).send();
    // });

});   






router.patch('/tasks/:id',auth,async(req,res)=>{
    const all=['Name','Desc','Completed'];
    const valid=Object.keys(req.body);
    const chk=valid.every((val)=> {return all.includes(val)});
    if(!chk){
        return res.status(400).send('Invalid Key');
    }
try
{
    const val = await task.findOne({_id:req.params.id,owner:req.user._id});
    console.log(val)
    valid.forEach((value)=>{
        val[value]=req.body[value];
    });
    await val.save();
    if(!val){
        return  res.status(404).send("Task Not found");
     }
    res.status(200).send();
}
catch(e){
    res.status(400).send();
}
});



router.delete('/tasks/:id',auth,async(req,res)=>{
    
    try
    {
        const val = await task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!val){
            return  res.status(404).send("Task Not found");
         }
        res.status(200).send("SUCCESSFULLY DELETED");
    }
    catch(e){
        res.status(400).send(e);
    }
    });

    module.exports=router;