const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();
const mongoose = require("mongoose");
const userModel = require("./models");
mongoose.connect("mongodb+srv://rrc:" + process.env.MONGODB_PWD + "@cluster0.vvv4rhf.mongodb.net/myFirstDb?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //cross-orign resource sharing
const app = express();
const port = 3001; // Must be different than the port of the React app
app.use(cors()); // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.json()); // Allows express to read a request body
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//get method
app.get('/users', async (req, res) => {
    const users = await userModel.find();
    res.send(users);
});

//getbyquery
app.get('/user', async (req, res) => {
    const username = req.query.username;
    const user = await userModel.findOne({ username: username });
    res.send(user);
});

//get by params
app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    const user = await userModel.findOne({ username: username });
    res.send(user);
})

//get body params
app.post('/users/get', async (req, res) => {
    const username = req.body.username;
    const user = await userModel.findOne({ username: username })
    res.send(user);
})

//post method
app.post('/users', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = {
        username: username,
        password: password
    };
    await userModel.create(user);
    res.send(user);
})

//update
app.put('/users', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = {
        username: username,
        password: password
    };
    const results = await userModel.replaceOne({ username: username }, user);
    res.send(results);
})

//delete
app.delete('/users/:username', async (req, res) => {
    const username = req.params.username;
    const results = await userModel.deleteOne({ username: username });
    res.send(results)
})

//register
app.post("/users/register", async (request, response) => {
    const id = request.body.id;
    const username = request.body.username;
    const password = request.body.password;
    try {
        if (
            username && validator.isAlphanumeric(username) &&
            password && validator.isStrongPassword(password)) {
            // Check to see if the user already exists. If not, then create it.
            const user = await userModel.findOne({ username: username });
            if (user) {
                console.log("Invalid registration - username " + username + " already exists.");
                response.send({ success: false });
                return;
            } else {
                hashedPassword = await bcrypt.hash(password, saltRounds);
                console.log("Registering username " + username);
                const userToSave = {
                    username: username,
                    password: hashedPassword
                };
                await userModel.create(userToSave);
                response.send({ success: true });
                return;
            }
        }
    } catch (error) { console.log(error.message); }
    response.send({ success: false });
});

//login
app.post("/users/login", async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    try {
        if (username && password) {
            // Check to see if the user already exists. If not, then create it.
            const user = await userModel.findOne({ username: username });
            if (!user) {
                console.log("Invalid login - username " + username + " doesn'texist.");
                response.send({ success: false });
                return;
            } else {
                const isSame = await bcrypt.compare(password, user.password);
                if (isSame) {
                    console.log("Successful login");
                    response.send({ success: true });
                    return;
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
    response.send({ success: false });
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))