const jwt=require('jsonwebtoken');
const User=require('../models/User');

const requireAuth=(req,res,next)=>{
 
    const token=req.cookies.jwt;
    //check json webtoken exists and  is valid
    if(token){
           jwt.verify(token,'secret',(err,decodedToken)=>{
                    if(err){
                        res.redirect('/login');
                       }

                    else{
                        console.log(decodedToken);
                        next();
                    }
           });
    }
    else{
        res.redirect('/login');
    }
}

const checkUser= (req,res,next)=>{
    const token=req.cookies.jwt;
    //check json webtoken exists and  is valid
    if(token){
           jwt.verify(token,'secret',async(err,decodedToken)=>{
                    if(err){
                       console.log(err.message);
                       res.locals.user=null;
                       next();
                       }

                    else{
                      console.log(decodedToken);
                      let user=await User.findById(decodedToken.id);
                      res.locals.user=user;
                      next();

                    }
           });
    }
    else{
        res.locals.user=null;
    }
}
module.exports={requireAuth};