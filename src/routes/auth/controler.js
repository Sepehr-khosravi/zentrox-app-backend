const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../../models");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

class Auth {
    openUserProfile = async(req , res)=>{
        try{
            const {userEmail} = req.body;
            console.log(userEmail);
            console.log("Hello world")
            const findUser = await userModel.findOne({email : userEmail});
            if(!findUser){
                res.status(404).json({message : "user not found" , error : true , data : {}});
                return;
            }
            res.status(200).json({message : "ok" , data : findUser , error : false});
        }
        catch(e){
            console.log("error in openUserProfile : " , e);
            res.status(500).json({message : "Interval server error." , data : null , error : true});
        }
    }
    //for following  :
    following = async(req, res)=>{
        try{ 
            const selfeUser = await userModel.findById(req.user);
            if(!selfeUser){
                return res.status(404).json({message : "user not found please first login or register ." , data : null , error : true});
            }
            const {email} = req.body;
            const purposeUser = await userModel.findOne({email});
            if(!purposeUser){
                return res.status(404).json({message : "there is no this user." , data : null , error : true});
            }
            if(purposeUser.followerUser.includes(selfeUser._id.toString())){
                return res.status(401).json({message : "you have already follow this user ." , data : true , error : true});
            }
            purposeUser.followerUser.push(selfeUser._id);
            purposeUser.followers++;
            await purposeUser.save();
            selfeUser.followingUser.push(purposeUser._id);
            selfeUser.following++;
            await selfeUser.save();
            
            res.status(200).json({message : "you following this user now ." , data : true , error : false});
        }
        catch(e){
            console.log("error in following api :" ,e );
            res.status(500).json({
                message: "Internal server error",
                error: true,
                data : null
            });        }
    }
    //for Unfollowing : 
    unFollow = async(req , res)=>{
        try{
            const selfeUser = await userModel.findById(req.user);
            if(!selfeUser){
                return res.status(404).json({message : 'user not found please first login or register .' , data : null , error : true });
            }
            const {email} = req.body;
            const purposeUser = await userModel.findOne({email});
            if(!purposeUser){
                return res.status(404).json({message : "there is no this user." , data : null , error : true});
            }
            if(!purposeUser.followerUser.includes(selfeUser._id.toString())){
                return res.status(401).json({message : "you don't have already follow this user ." , data : false , error : true});
            }
            purposeUser.followerUser = purposeUser.followerUser.filter(item => item.toString() !== selfeUser._id.toString());
            if(purposeUser.followers > 0) purposeUser.followers--;
            await purposeUser.save();
            selfeUser.followingUser =  selfeUser.followingUser.filter(item => item.toString() !== purposeUser._id.toString());
            if(selfeUser.following > 0) selfeUser.following--; 
            await selfeUser.save();
            res.status(200).json({message : "you unFollowing this user right now." , error : false , data : false});
        }
        catch(e){
            console.log("error in unFollowing api :" , e);
            res.status(500).json({message : "Internall server." , error : true , data : null});
        }
    }
    getId = async(req, res)=>{
        try{
            if(!req.user){
                return res.status(401).json({message : "access denied" , data : null , error : true});
            }
            const findUser = await userModel.findById(req.user).select("_id name email");
            if(!findUser) {
                return res.status(404).json({message : 'user not found.' , error : true , data : null}) ;
            }
            res.status(200).json({message : "ok" , error : false , data : findUser._id , info : {name : findUser.name , email : findUser.email}});
        }
        catch(e){
            console.log("error in getting Id : " ,e);
        }
    }
    //for checking premiumUser or not :
    checkPremium = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized",
                    error: true,
                    isPremium: false
                });
            }

            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    error: true,
                    isPremium: false
                });
            }

            return res.status(200).json({
                message: user.isPremium ? "Premium user" : "Regular user",
                error: false,
                isPremium: user.isPremium
            });
        } catch (e) {
            console.error("Error:", e);
            res.status(500).json({
                message: "Internal server error",
                error: true,
                isPremium: false
            });
        }
    }
    //for verify token :
    verifyToken = async (req, res) => {
        try {
            const { token } = req.body;
            const decode = await jwt.verify(token, process.env.JWT_KEY);
            if (!decode) {
                res.status(200).json({ message: "user not found", data: null, error: true });
                return;
            }
            req.user = decode.userId;
            res.status(200).json({ message: "welcome to the Zentrox", data: { userId: req.user }, error: false });
        }
        catch (e) {
            console.error("Error:", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const findUser = await userModel.findOne({ email });
            if (findUser) {
                res.status(400).json({ message: "invalid email or password", error: "invalid email or password", data: {} });
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = await userModel.create({ name: name, email: email, password: hashPassword });
            const token = await jwt.sign({ userId: newUser.id }, process.env.JWT_KEY);
            res.status(200).json({ message: "successfuly to register", data: { name: newUser.name, email: newUser.email, token: token } });
        }
        catch (e) {
            console.error("JWT Error:", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    verification = async (req, res) => {
        try {
            const code = Math.floor(1000 + Math.random() * 9000);
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "sponskhosravi1404@gmail.com",
                    pass: "bmuqbjhzaiwkfbfv"
                }
            });
            const { email } = req.body;
            const mailOptions = {
                from: "sponskhosravi1404@gmail.com",
                to: email,
                subject: "Welcome",
                text: "please enter this code in the application",
                html: `<h2>code : ${code}</h2>`
            }
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "the code has been send to your email " });
        }
        catch (e) {
            console.log("error verification : ", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "invalid email or password", error: "invalid email or password", data: {} });
                return;
            }
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                res.status(400).json({ message: "invalid email or password", error: "invalid email or password", data: {} });
                return;
            }
            const token = await jwt.sign({ userId: user.id }, process.env.JWT_KEY);
            res.status(200).json({ message: "successfuly to login", data: { name: user.name, email: user.email, token: token } });
        }
        catch (e) {
            console.error("JWT Error:", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}


module.exports = new Auth;