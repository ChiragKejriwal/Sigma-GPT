const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:['user','assistant'],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId:{
        type:String,
        required:true,
        unique:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title:{
        type:String,
        required:true,
        default:"New Chat",
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports = mongoose.model("Thread",ThreadSchema);