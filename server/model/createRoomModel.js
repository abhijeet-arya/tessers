const mongoose = require('mongoose')

const createRoomSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        unique:true,
    },
    roomType:{
        type:String,
        required:true
    },
    time : { type : Date, default: Date.now }
})

const createRoom = mongoose.model('createRoom',createRoomSchema);
module.exports = createRoom;