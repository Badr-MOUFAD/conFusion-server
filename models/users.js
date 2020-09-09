const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    }
}).plugin(passportLocalMongoose);

const Users = mongoose.model("User", userSchema);

module.exports = Users;