const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer  = require('nodemailer');
const User = require('../model/userSchema');
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rajagrawal9630@gmail.com', // Replace with your Gmail address
      pass: 'wwigshnahsqefrja' // Replace with your Gmail password or an app-specific password
    }
  });


// Store generated OTPs (replace this with a proper database in production)
const otpStorage = {};

let email="";

router.post('/send-otp', async (req, res) => {
    email = req.body.email;

    if(!email){
      return res.status(400).json({error:"please fill the form correctly"});
    }

    const userVerification = await User.findOne({email:email});

    if(!userVerification){
      return  res.status(401).json({error:"Opps! this email not registered"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const expirationTime = Date.now() + 60000; // OTP expires after 10 minutes (600000 milliseconds)
    otpStorage[email] = { otp: otp.toString(), expirationTime };
  
    const mailOptions = {
      from: 'rajagrawal9630@gmail.com', // Replace with your Gmail address
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Error sending OTP' });
      } else {
        console.log('OTP sent:', info.response);
        res.json({ message: 'OTP sent successfully' });
      }
    });
  });
  
  // Verify OTP
  router.post('/verify-otp', (req, res) => {
    const userOTP = req.body.otp;

    if(!userOTP){
      return res.status(400).json({error:"please fill the form correctly"});
    }
  
    if (otpStorage[email] && otpStorage[email].otp === userOTP && Date.now() <= otpStorage[email].expirationTime) {
      // OTP is valid and within expiration time
      delete otpStorage[email]; // OTP can only be used once
      res.json({ message: 'OTP verified successfully' });
    } else {
      // Invalid OTP or expired
      res.status(400).json({ error: 'Invalid OTP or expired' });
    }
});

router.post("/reset-password",async (req,res) => {

    const newPassword = req.body.password;
    const cnewPassword = req.body.cpassword;

    if(!newPassword || !cnewPassword)
    {
      res.status(400).json({ error: 'please fill form' });
    }
    else if(newPassword != cnewPassword)
    {
      res.status(401).json({ error: 'please fill form' });
    }
    else{

        try{
            //findByIdANdUpdate == first find and then update
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            
            const result = await User.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        password: hashedPassword,
                        cpassword: hashedPassword // It's unclear why you're hashing cnewPassword as well
                    }
                },
                {
                    new: true,
                    useFindAndModify: false
                }
            )  ;
            return res.status(200).json({ message: 'Password reset successful' });
        }
        catch(err){
            console.log(err);
        }

    }
  

})


module.exports = router;