const express = require("express");
const Router = express.Router();
const Search = require("./controler");

//for searching the users : 
Router.post("/users" , Search.searchUsers );

//for searching the posts :
Router.post("/posts" , Search.searchPosts);

//for searching the posts just with its title :
Router.post("/posts/title" , Search.searchThePostsJustTitle);

module.exports = Router;
