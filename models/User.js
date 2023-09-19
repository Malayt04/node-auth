const mongoose = require('mongoose');
const {isEmail}=require('validator');
const bcrypt =require('bcrypt');

const userSchema=new mongoose.Schema({

email:{
type:String,
required:[true,'Please enter a valid email address'],
unique:true,
lowercase:true,
validate:[isEmail,'Please enter a valid email address']
}
,
password:{
    type:String,
    required:[true,'Please enter a valid password'],
    minlength:[8,'Password must be at least 8 characters']
}

});


/*
//fire a function before the data is saved to db
userSchema.pre('save',async function(next){
   const salt=await bcrypt.genSalt();
   this.password=await bcrypt.hash(this.password,salt);
    next();
})
*/

userSchema.statics.login=async function (email,password){
const user=await this.findOne({email});
if(user){
  const auth= await  bcrypt.compare(password,user.password);

  if(auth){
    return user;
  }
  throw Error('Incorrect password');
}
throw Error('incorrect email');
}

const User=mongoose.model('user',userSchema);


module.exports=User;