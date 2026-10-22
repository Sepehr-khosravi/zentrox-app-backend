const express = require("express");
const Router = express.Router();
const Posts = require("./controler");

//for getting the specialpost :
Router.post("/get" , Posts.getAPosts);


//for uploading api :
Router.post("/upload" , Posts.upload);

//for deleteing api :
Router.post("/delete" , Posts.delete);

//for liking the video :
Router.post("/like" , Posts.like);

//for opening the user profile :
Router.get("/open" , Posts.openProfile );

//for specialPosts :
Router.get("/special" , Posts.specialPosts);

//for getting comments :
Router.post("/comment" , Posts.getComments );

//for uploading comment : 
Router.post("/comment/upload" , Posts.uploadComment);

//for deleting comment :
Router.post('/comment/delete' , Posts.delete);

module.exports = Router;