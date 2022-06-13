const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
    }
});

const userDB = mongoose.model('userDB',signUpSchema);

module.exports = userDB;
