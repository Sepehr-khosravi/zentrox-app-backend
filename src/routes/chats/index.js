const express = require("express");
const Router = express.Router();
const Chats = require("./controler");

//for opening a conversation :
Router.get("/openDm/:conversationId" , Chats.openConversations);

//for getting every conversations do you have :
Router.get("/conversations" , Chats.getConversations);

//for accepting friendsRequest : 
Router.post("/acceptRequest" , Chats.acceptFirendRequest);

//for sending the friend request : 
Router.post("/friendRequest" , Chats.addFriend);

//for getting every friends request do you have :
Router.get("/FriendRequestList" , Chats.getFriendsRequestList);

module.exports = Router;