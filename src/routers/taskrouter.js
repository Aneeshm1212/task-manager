const express=require('express');
const router = new express.Router();
require('../databse/mongoosedb.js');
const task=require('../models/tasks.js');


router.post('/tasks',async(req,res)=>{
    const tasks =new task(req.body);

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

router.get('/tasks',async(req,res)=>{
    try{
        const val = await task.find({})
        res.status(201).send(val);
       }
       catch(e){
           res.status(400).send(e)
       }
    // task.find({}).then((r)=>{ 
    //     res.send(r)
    // }).catch((e)=>{
    //     res.status(500).send(e);
    // });
});  

router.get('/tasks/:id',async(req,res)=>{

    try{
        const val = await task.findById(req.params.id);
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






router.patch('/tasks/:id',async(req,res)=>{
    const all=['Name','Desc','Completed'];
    const valid=Object.keys(req.body);
    const chk=valid.every((val)=> {return all.includes(val)});
    if(!chk){
        return res.status(400).send('Invalid Key');
    }
try
{
    const val = await task.findById(req.params.id);
    valid.forEach((value)=>{
        val[value]=req.body[value];
    });
    await val.save();
    if(!val){
        return  res.status(404).send("Task Not found");
     }
    res.status(200).send(val);
}
catch(e){
    res.status(400).send(e);
}
});



router.delete('/tasks/:id',async(req,res)=>{
    
    try
    {
        const val = await task.findByIdAndDelete(req.params.id);
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