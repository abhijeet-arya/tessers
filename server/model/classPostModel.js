const mongoose = require('mongoose');

const classPostSchema = new mongoose.Schema({
    time : { type : Date, default: Date.now },
    classId:{
        type:String,
        required:true,
    },
    postType:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:false,
    },
    body:{
        type:String,
        required:false,
    },
    comments:{
        type:Array,
        default:[]
    },
    documentLinks:{
        type:Array,
        default:[]
    },
    datePosted:{
        type:String,
        required:true,
    },
    submissionDate:{
        type:String,
        required:false
    },
    marks:{
        type:String,
        required:false
    }
})

const classPost = mongoose.model('classPost',classPostSchema);
module.exports = classPost;