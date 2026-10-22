const express = require("express");
const Router = express.Router();
const Admin = require("./controler");

//for getting every users :
Router.get("/getUsers" , Admin.getUser );

//for getting every posts : 
Router.get("/getPosts" , Admin.getPost);

//for deleting the user : 
Router.post("/deleteUser" , Admin.deleteUser);

//for deleting the post : 
Router.post("/deletePost" , Admin.deletePost );

//for editing the user : 
Router.post("/editUser" , Admin.editUser);

//for hidding posts : 
Router.post("/hide" , Admin.hidePost);

module.exports = Router ;

