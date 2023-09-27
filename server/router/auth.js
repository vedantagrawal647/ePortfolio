
//step1 require express jwtoken bcrypt 
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const authenticate = require("../middleware/authentication")


//step2 require Router
const router = express.Router();

//step3  require database
require('../db/conn');

//step4  require userSchema
const User = require("../model/userSchema");

//step5 routing 
router.get('/',(req,res) => {
    res.send("Hello routing apge");
})

//step7
router.post('/signup',async (req,res) => {

    //7.1
    try{
        const {fname,lname,email,password,cpassword} = req.body;

        if(!fname || !lname || !email || !password || !cpassword){
            return res.status(422).json({error:"please fill the form correctly"});
        }

        const userLogin = await User.findOne({email:email});

        if(userLogin){
           return  res.status(422).json({error:"user mail already exist"});
        }
        else if(password != cpassword){
            return res.status(422).json({error:"password and cPassword are mismatch"});
        }
        else{
            const user = new User({fname,lname,email,password,cpassword});

            //7.1 generate hash password in userSchema before "save"

            await user.save();
            res.status(200).json({messgae:"user signup successfully"});
        }
    }
    catch(err){
        console.log(error);
    }

})

//step8
router.post('/signin',async (req,res) => {

    //8.1
    try{

        let token;
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({error:"please fill the form correctly"});
        }

        const userLogin = await User.findOne({email:email});

        if(!userLogin){
           return  res.status(400).json({error:"Opps! this email not registered"});
        }
        else{
            //8.2 comapre hash password
            const isMatch = await bcrypt.compare(password,userLogin.password);

            if(isMatch){
        
                //8.3 generate token -- see userSchema
                token = await userLogin.generateAuthToken();

                //8.4 save token in cookie
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now() + 600000),
                    httpOnly:true
                });

                res.status(200).json({messgae:"user signin successfully"});
            }else{
                return  res.status(400).json({error:"password missmatch"});
            } 
        }
    }
    catch(err){
        console.log(error);
    }    
})

//step10 get userdata to contact us
router.get("/getData",authenticate,(req,res) => {
    res.status(200).send(req.rootUser);
})

//step11 storing contact data to database
router.post('/contact',authenticate,async (req,res) => {
    try{
        const {name,email,phone,message} = req.body;

        if(!name || !email || !phone || !message){
            console.log("error in contact form")
            return res.status(401).json({error:"please filled the contact form"})
        }

        const  userContact = await User.findOne({_id:req.userID});

        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone ,message);
            

            await userContact.save();
            console.log(userContact);
            
            res.status(201).json({message:"user Conatct successfully"});
        }

    }catch(err)
    {
        console.log(err);
    }
})



//step9 
router.get('/logout',(req,res) => {
    console.log(`Hello my logout`);
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("User Logout");
})


//step6 exports routers
module.exports = router