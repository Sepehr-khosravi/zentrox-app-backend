const mongoose = require("mongoose");

//for make a good structure for the data:
const schema = new mongoose.Schema({
    profile : {type : String , default : ""} ,
    name : {type : String , required : true} ,
    email : {type : String , required : true , unique : true} ,
    bio : {type : String , default : ""} ,
    password : {type : String , required : true} ,
    posts : [{type : mongoose.Schema.Types.ObjectId , ref : "posts" }] ,
    isPremium : {type : Boolean, default : false} ,
    isAdmin : {type  : Boolean , default : false} ,
    followers : {type : Number , default : 0} ,
    following  : {type : Number , default : 0} ,
    followerUser : [{type : mongoose.Schema.Types.ObjectId  , ref : "users" , default : []}] ,
    followingUser : [{type : mongoose.Schema.Types.ObjectId , ref : "users" , default : []}] ,
    savePosts : [{type : mongoose.Schema.Types.ObjectId , ref : "posts" , default : []}] ,
    blockUsers : [{type : mongoose.Schema.Types.ObjectId , ref : "users" , default : []}] ,
    notifications : [{type : mongoose.Schema.Types.ObjectId , ref: "notifications" , default : []}] ,
    onlineAt : {type : Date , default : Date.now } ,
    isOnline : {type : Boolean , default : false} ,
    conversationId : [{type : mongoose.Schema.Types.ObjectId , ref : "conversations" , default : []}] ,
    friends : [{type : mongoose.Schema.Types.ObjectId , ref : "users" , default : []}] ,
    friendRequest : [{type : mongoose.Schema.Types.ObjectId , ref : "users" , default : []}] 
});


//for make a model :
const model  = mongoose.model("users" , schema);


module.exports = model;