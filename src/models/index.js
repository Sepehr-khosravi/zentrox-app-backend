const mongoose = require("mongoose");
// const config = require("config");
const dotnev = require("dotenv");
dotnev.config();

//for starting data base:
mongoose.connect(process.env.DATABASE_URL | "")
    .then(() => {
        console.log("server is connected to the database");
    })
    .catch((e) => {
        console.log("error in connecting to the data base :", e);
    })



//for getting model Users:
const userModel = require("./users");

//for getting model Posts :
const postModel = require('./posts');


//for getting model hidePosts :
const hidePostModel = require("./hidePost")

//for getting model comments :
const commentModel = require("./comments");

//for getting model notification : 
const notificationModel = require("./notifications");


//for getting socket model : 
const socketModel = require("./socket");


//for getting conversations model :
const conversationModel = require("./conversations");


//for getting the savePosts model :

const savePostModel = require("./savePosts");

//for getting the textMessage model:

const textMessageModel = require("./textMessage");


module.exports = {
    userModel,
    postModel,
    hidePostModel,
    commentModel,
    notificationModel,
    socketModel ,
    conversationModel ,
    savePostModel ,
    textMessageModel
};
