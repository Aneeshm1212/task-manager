const user=require('../models/user.js');
const jwt =require('jsonwebtoken');
const auth = async(req,res,next)=>{
try{
    const key = req.header('auth');
    const decode = jwt.verify(key,'kskssjsjasj');
    const realuser = await  user.findOne({_id:decode._id, 'Tokens.Token':key});
    if(!realuser)
    {
        throw new Error();
    }
  
   req.token=key;
   req.user =realuser;
   next()
}
catch(e){
    res.status(401).send('Unsucessful');
}
};
module.exports=auth;