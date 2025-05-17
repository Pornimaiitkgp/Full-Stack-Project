const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: null,
        required: true,
    },
    ladsname: {
        type: String,
        default: null,
        required: true,
    },
    email: {
        type: String,
        default: null,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("user", userSchema); //using this schema it will create a model(table)