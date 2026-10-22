const {userModel} = require("../models");


async function checkAdmin(req , res , next){
    try{
        if(!req.user){
            res.status(401).json({message : "Unauthorized: user ID not found in request"});
            return;
        }
        const userId = req.user;
        const findUser = await userModel.findById(userId);
        if(!findUser){
            res.status(404).json({message : "User not found."});
            return;
        }
        if(!findUser.isAdmin){
            res.status(401).json({message : "access denied"});
            return;
        }
        return next();
    }
    catch(e){
        console.log("error in checkAdmin middleware : " , e);
        res.status(500).json({message : "Internal server"});
    }
}

module.exports = checkAdmin;