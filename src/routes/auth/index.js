const express =require("express");
const Router = express.Router();
Router.use(express.json());
const Auth = require("./controler");
const validate = require("../validator");
const protectionMiddleware = require("../../middleware/auth");

//api for /login route :
Router.post("/login" , validate.loginValidate() , validate.validation , Auth.login);

//api for /register route :
Router.post("/register" , validate.registerValidate() , validate.validation , Auth.register);


//api for sending verification code :
Router.post("/verification" , Auth.verification);

Router.post("/verify" , Auth.verifyToken);

Router.get("/premium" , protectionMiddleware , Auth.checkPremium);

//for getting user Id :
Router.get("/id" , protectionMiddleware , Auth.getId);

//for following the users :
Router.post("/follow" , protectionMiddleware , Auth.following)

//for unFollowing the users : 
Router.post("/unfollow" , protectionMiddleware , Auth.unFollow);

//for openning the userProfile : 
Router.post("/open" , protectionMiddleware, Auth.openUserProfile);

module.exports = Router;