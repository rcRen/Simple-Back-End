const moogoose = require("mongoose");
const UserSchema = new moogoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

const User = moogoose.model("user", UserSchema);
module.exports = User;