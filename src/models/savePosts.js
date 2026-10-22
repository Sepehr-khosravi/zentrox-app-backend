const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    postId : {type : mongoose.Schema.Types.ObjectId , ref : "posts" , required : true } ,
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "users" , required : true}
}, { timestamps: true });


const model = mongoose.model("savePosts" , schema );


module.exports  = model;