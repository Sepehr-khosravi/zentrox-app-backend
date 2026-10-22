const express = require("express");
const Router = express.Router();
const exploreControler = require("./controler");

Router.get("/posts" , exploreControler.posts);


module.exports = Router;