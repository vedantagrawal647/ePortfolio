//step1  install ---  npm init
//step2  install ---  npm i express mongoose dotenv bcryptjs jsonwebtoken cookir-parser 


//step3  Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

//step4  Initialize express app
const app = express();

//step5  Load the environment variables from config.env file
dotenv.config({ path: './config.env' });

//step6  Set the port number from the environment variable
const PORT = process.env.PORT;

//step13  Use cookie-parser middleware
app.use(cookieParser());

//step9  Parse JSON data
app.use(express.json());

//step12 Include routing file if necessary
app.use(require('./router/auth'));

//step14 OTP Verification
app.use(require('./router/OTP'));

//step10  Require database connection
require('./db/conn.js');

//step11  Require user schema
require('./model/userSchema');


//step7 Define routes
app.get('/', (req, res) => {
  res.send("Hello Server Page");
});

//step8  Start the server
app.listen(PORT, () => {
  console.log(`Server is running at port no. ${PORT}`);
});
