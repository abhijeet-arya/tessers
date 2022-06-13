const mongoose = require('mongoose')

const publicClassSchema = new mongoose.Schema({

    classId:{
        type:String,
        required:true,
        unique:true,
    },
    courseName:{
        type:String,
        required:true,
    },
    usersJoined:{
        type:Array,
        default:[],
    },
    takeAttendance:{
        type:Boolean,
        required:true,
    },
    attendance:{
        type:Array,
        default:[]
    }
})