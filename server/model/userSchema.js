
//step1 require mongoose
const mongoose = require('mongoose');
//step5 require bcryptjs
const bcrypt = require("bcryptjs");
//step7 require jsonwebtoken
const jwt = require("jsonwebtoken");

//step2  define schema
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    },
    messages:[{
        name:{
            type:String,
            requires:true
        },
        email:{
            type:String,
            requires:true
        },
        phone:{
            type:Number,
            requires:true
        },
        message:{
            type:String,
            requires:true
        }
    }],
    tokens:[
        {
            token:{
                type:"String",
                required:true
            }
        }
    ]
})

//step6 we are hashing the password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
        next();
    }
})

//step8 generate token
userSchema.methods.generateAuthToken =async function(){
    try{
        // 1st is payload and 2nd is secretkey
        let token = jwt.sign({_id: this._id},process.env.SECRET_KEY);

        //LHS -- schema token , RHS -- generate token
        this.tokens = this.tokens.concat({token:token})

        await this.save();
        return token;
        
    }catch(err)
    {
        console.log(err)
    }
}

//step9 strored the message
userSchema.methods.addMessage = async function (namevalue,emailvalue,phonevalue,messagevalue){
    try{

        this.messages =  this.messages.concat({
                name:namevalue,
                email:emailvalue,
                phone:phonevalue,
                message:messagevalue
        })

        await this.save();
        return this.message;

    }catch(err){
        console.log(err);
    }
}

//step3 create collection
const Users = mongoose.model('USER',userSchema);

//step4 export module
module.exports = Users;