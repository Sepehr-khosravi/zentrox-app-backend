const {userModel ,postModel , hidePostModel} = require("../../models");


class Admin {
    getUser = async(req, res)=>{
        try{
            const users = await userModel.find();
            if(!users){
                res.status(404).json({message : "Users not found"});
                return;
            }
            res.status(200).json({message : "succesfully to get users" , data : users})
        }
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
    deleteUser = async(req , res)=>{
        try{
            const {email} = req.body;
            const user = await userModel.findOne({email});
            if(!user){
                res.status(404).json({message : "user not found"});
                return;
            }
            await userModel.deleteOne(user);
            res.status(200).json({message : "succesfully to delete users"});
        }
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
    editUser = async(req , res)=>{
        try{
            const { beforeEmail , afterName , afterEmail} = req.body;
            const user = await userModel.findOne({email : beforeEmail});
            if(!user){
                res.status(404).json({message : "user not found"});
                return;
            }
            await userModel.updateOne(user , {name : afterName , email : afterEmail});
            res.status(200).json({message : "succesfully to edit the User"});
        }
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
    getPost = async(req , res)=>{
        try{
            const {name , email} = req.body;
            const findUser = await userModel.findOne({name , email});
            if(!findUser){
                res.status(404).json({message : "user Not found"});
                return;
            }
            const findPost = await postModel.find({userId : findUser._id});
            if(!findPost){
                res.status(404).json({message : "posts not found"});
                return;
            }
            res.status(200).json({message : "succesfully to get posts" , data : findPost});
        }
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
    deletePost = async(req , res)=>{
        try{
            const {title , description , userId} = req.body;
            const post = await postModel.findOne({title , description , userId});
            if(!post){
                res.status(404).json({message : "post not found"});
                return;
            }
            await postModel.deleteOne(post);
            res.status(200).json({message : "succesfully to delete post"});
        }
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
    hidePost = async(req , res)=>{
        try{
            const {title , description , userId} = req.body;
            const findPost = await postModel.findOneAndDelete({title , description , userId});
            if(!findPost){
                res.status(404).json({message : "post not found , system can't delete it"});
                return;
            }
            await hidePostModel.create(findPost);
            await postModel.deleteOne(findPost);
            res.status(200).json({message : "you have added post to hidePosts"});
        } 
        catch(e){
            console.log("error in gettingUser in admin panel");
            res.status(500).json({message : "Internal server."});
        }
    }
}


module.exports = new Admin;