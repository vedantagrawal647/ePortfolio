//step1
const jwt = require("jsonwebtoken");

//step2
const User = require("../model/userSchema");


//step3
const Authenticate = async (req,res,next) => {
    try{

        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

        const rootUser = await User.findOne({
            _id:verifyToken._id,
            "tokens.token":token
        });
        

        if(!rootUser){
            throw new Error("user not found")
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }
    catch(err){
        res.status(401).send("Unauthorized:No Token provided");
        console.log(err);
    }
}

//step4
module.exports = Authenticate;