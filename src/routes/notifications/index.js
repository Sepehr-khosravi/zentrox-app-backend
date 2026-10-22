const express =require("express");
const Router = express.Router();
const Notifications = require("./controler")

//for getting every notificaions in program :
Router.get("/get" , Notifications.getNotifications);

//for sending the notificaion to  desierd  user : 
Router.post("/send" , Notifications.sendNotification);

module.exports = Router;