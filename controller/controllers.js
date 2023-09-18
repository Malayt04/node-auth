const User=require('../models/User');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');




const maxAge=3*24*60*60;

const createToken =(id)=>{
    return jwt.sign({id},'secret',{
        expiresIn:maxAge
    })
}


const handleError=(err)=>{
    console.log(err.message,err.code);
    let errors={email:'',password:''};

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        });
    }

    if(err.code==11000){
        errors.email='That email already exists';
    }
    return errors;
}



const getSignUpPage=(req,res)=>{
    res.render('signup');
}



const getLoginPage=(req,res)=>{
    res.render("login");
}



const postSignUp=async(req,res)=>{

    const {email,password}=req.body;

    try {
     const newUser=await User.create({email,password});

     const token=createToken(newUser._id);
     res.cookie('jwt',token,{httpOnly:false,maxAge:maxAge*1000});

     console.log(newUser);
     res.status(201).json({newUser:newUser._id});
    } catch (error) {
       const err = handleError(error);
        res.status(400).json({err})
    }
  
}   

const postLogin=async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.login(email,password);
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:false,maxAge:maxAge*1000});
        res.send(user._id);
    } catch (error) {
        console.log(error);
    }
    
   
}

module.exports={getSignUpPage,postLogin,getLoginPage,postSignUp};