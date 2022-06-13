const mongoose = require('mongoose');

const privateClassSchema = new mongoose.Schema({
    teacherId:{
        type:String,
        required:true,
    },
    teacherName:{
        type:String,
        required:true
    },
    classId:{
        type:String,
        required:true,
        unique:true,
    },
    className:{
        type:String,
        required:true,
    },
    subName:{
        type:String,
        required:true,
    },
    classStarted:{
        type:Boolean,
        default:false,
    },
    usersJoined:{
        type:Array,
        default:[]
    },
    takeAttendance:{
        type:Boolean,
        required:true,
    },
    faceEncodes:{
        type:Array,
        default:[]
    },
    attendance:{
        type:Array,
        default:[],
    },
    restrictUser:{
        type:Boolean,
        default:false,
    },
    allowedUsers:{
        type:Array,
        default:[]
    },


})

const privateClass = mongoose.model('privateClass',privateClassSchema);
module.exports = privateClass;