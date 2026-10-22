const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "users"}, 
    message : {type : String , required : true},
    conversationId : {type : mongoose.Schema.Types.ObjectId , ref : "conversations" , required : true} ,
    isSeen : {type : Boolean , default : false} 
} , {timestamps : true})


const model = mongoose.model("textMessage" , schema);


module.exports = model;