const express = require("express");
const Router = express.Router();
const Dashboard = require("./controler");

//for getting infoSelfProfile api :
Router.get("/profile" , Dashboard.infoSelfProfile);

//for changing the user name : 
Router.post("/change/name" , Dashboard.changeName);

//for deleting the user :
Router.get("/delete" , Dashboard.deleteAcount);

//for getEveryPosts :
Router.get("/posts" , Dashboard.getPosts);

//for getting the selfPosts : 
Router.get("/get/self/post" , Dashboard.getTheSelfPosts);


module.exports = Router;