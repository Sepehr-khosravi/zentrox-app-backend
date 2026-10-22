const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    users :  [{type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true}] ,
    lastMessage : {type : String , default : "start the conversation"}
} , {timestamps : true});

const model = mongoose.model("conversations" , schema);


module.exports = model;