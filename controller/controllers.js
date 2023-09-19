const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');





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

    if(err.message=='incorrect email'){
        errors.email='incorrect email';
    }
    if(err.message=='incorrect password'){
        errors.password='incorrect password';
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
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser=new User({email,password:hashedPass});

    try {
     
      await newUser.save();
     const token=createToken(newUser._id);
     res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
     console.log(newUser);
     res.status(201).json({newUser:newUser._id});
    } catch (error) {
       const err = handleError(error);
        res.status(400).json({err})
    }
  
}   

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user=await User.login(email, password);
      const token=createToken(user._id);
     res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
      res.status(200).json({user:user._id});
    } catch (error) {
    const errors=handleError(error);
      res.status(500).json({errors})
    }
  };

  const getLogoutPage=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
  }

module.exports={getSignUpPage,postLogin,getLoginPage,postSignUp,getLogoutPage};