const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true} ,
    socketId : {type : String , required : true} ,
    device : {type : String , default : "unknown"} ,
    ip : {type : String , default : "unknown"} ,
    connectedAt : {type : Date , default : Date.now}
});

const model = mongoose.model("sockets" , schema );

module.exports = model;