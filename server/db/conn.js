
//step1 require mongoose
var mongoose = require('mongoose');

//step2 require database url from config.env
const DB_URL = process.env.DB_URL;

//step3  estanblish connnection with mongoose database
mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log(`connection successful`);
}).catch((err) => {
    console.log(`no connection`);
})