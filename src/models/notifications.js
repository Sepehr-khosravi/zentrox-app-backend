const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    from : {type : String , required : true} ,
    to : {type : String , required : true} ,
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "users"} ,
    username : {type : String , required : true} ,
    avatar : {type : String , default : "" } ,
    message : {type : String , required : true} ,
    type : {type : String , required : true} 
} , {timestamps : true});

const model = mongoose.model("notifications" , schema);


module.exports = model;