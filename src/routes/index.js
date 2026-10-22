const express = require("express");
const Router = express.Router();
Router.use(express.json());

const PostsRouter = require("./posts");

const DashboardRouter = require("./dashboard");

const ExploreRouter = require("./explore");

const AdminProtection = require("../middleware/admin");

const AdminRouter = require("./admin");

const SearchRouter = require("./search");

const ChatRouter = require("./chats");


const NotificationRouter = require("./notifications");

//protection routes :
const AuthMiddleWare = require("../middleware/auth");

//for user login and register api:
const AuthRouter = require("./auth");
// All auth related routes are assigned to the auth folder:

//for checking the user (token and info :) : 
const jwt = require("jsonwebtoken");
const config = require("config");
Router.get("/checkUser", async (req, res) => {
    try {
        const auth = req.headers["auth-token"];
        const token = auth && auth.startsWith("Bearer") ? auth.split(" ")[1] : null;
        if (!auth || !token) {
            res.status(200).json({ message: "please login or register!", isLogin: false });
            return;
        }
        const decode = jwt.verify(token, config.get("jwtKey"));
        if (!decode || !decode.userId) {
            res.status(200).json({ message: "please login or register!", isLogin: false });
            return;
        }
        res.status(200).json({ message: "ok", isLogin: true });
    }
    catch (e) {
        console.log("checkUser token error : (in index.js in routes folder) :", e);
    }
});

Router.use("/auth", AuthRouter);

//for posts api :
Router.use("/post", AuthMiddleWare, PostsRouter);


//for dashboard api :
Router.use("/dashboard", AuthMiddleWare, DashboardRouter);

//for explore api:
Router.use("/explore", AuthMiddleWare, ExploreRouter);

//for adming premision : 
Router.use("/admin", AuthMiddleWare, AdminProtection, AdminRouter);

//for searching  : 
Router.use("/search", AuthMiddleWare, SearchRouter);

//for notification : 
Router.use("/notification", AuthMiddleWare, NotificationRouter);


//for chats api :
Router.use("/chat", AuthMiddleWare, ChatRouter);

module.exports = Router;