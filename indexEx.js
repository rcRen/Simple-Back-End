require('dotenv').config();
const mongoose = require("mongoose");
const userModel = require("./models");
mongoose.connect("mongodb+srv://rrc:" + process.env.MONGODB_PWD + "@cluster0.vvv4rhf.mongodb.net/myFirstDb?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error".console.error.bind(console, "connection error: "));
db.once("open",function(){
    console.log("connected!!")
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('./users', async(req, res)=>{
    const users = await userModel.find();
    res.send(users);
});

app.listen(port, ()=> console.log(`Hello world app listening on port ${port}!`));