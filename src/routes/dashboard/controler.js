const { userModel, postModel } = require("../../models/index");
const bcrypt = require("bcrypt");

class Dashboard {
    infoSelfProfile = async (req, res) => {
        try {
            const userId = req.user;
            const user = await userModel.findById(userId).select("name profile email posts followers following followerUser followingUser isPremium _id");
            if (!user) {
                res.status(404).json({ message: 'User not found', data: null, error: "noUser" });
                return;
            }
            res.status(200).json({ message: "successfuly to get your data ", data: user });
        }
        catch (e) {
            console.log("error in infoSelfProfile function :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    changeName = async (req, res) => {
        try {
            const userId = req.user;
            const { newName, password } = req.body;
            if (newName && password) {
                const user = await userModel.findById(userId);
                if (user) {
                    const checkPassword = await bcrypt.compare(password, user.password);
                    if (!checkPassword) {
                        res.status(400).json({ message: "invalid password", data: null });
                        return;
                    }
                    user.name = newName;
                    await user.save();
                    res.status(200).json({ message: "succesfully to change your name", data: { name: newName, email: user.email, _id: user._id } });
                }
                else {
                    res.status(404).json({ message: "user not fount", data: null });
                }
            }
            else {
                res.status(400).json({ message: "invalid data", data: null });
            }
        }
        catch (e) {
            console.log("error in changeName funciton :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    deleteAcount = async (req, res) => {
        try {
            const userId = req.user;
            const { email, password } = req.body;
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found', data: null });
                return;
            }
            const checkPassword = await bcrypt.compare(password, user.password);
            if (email === user.email && checkPassword) {
                await userModel.deleteOne({ email });
                res.status(200).json({ message: "system has been deleted your acount" });
            }
            else {
                res.status(400).json({ message: 'invalid data', data: null });
            }
        }
        catch (e) {
            console.log("error in deleteAcount funciton :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    changeEmail = async (req, res) => {
        try {
            const { email, newEmail, password } = req.body;
            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(404).json({ message: "user not found", data: null, error: true });
            }
            if (email === user.email) {
                const check = await bcrypt.compare(password, user.password);
                if (!check) {
                    return res.status(401).json({ message: "access denied", data: null, error: true });
                }
                user.email = newEmail;
                await user.save();
                res.status(200).json({ message: "succesfully to change email.", data: user, error: false });
            }
            else {
                return res.status(401).json({ message: "access denied", data: null, error: true });
            }
        }
        catch (e) {
            console.log("error in deleteAcount funciton :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    changePassword = async (req, res) => {
        try {
            const { email, newPassword, password } = req.body;
            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(404).json({ message: "user not found", data: null, error: true });
            }
            if (email === user.email) {
                const check = await bcrypt.compare(password, user.password);
                if (!check) {
                    return res.status(401).json({ message: "access denied", data: null, error: true });
                }
                const salt = await bcrypt.genSalt(10);
                const hashNewPassword = await bcrypt.hash(newPassword, salt);
                if (!hashNewPassword) {
                    return res.status(401).json({ message: "bad request!", data: null, error: true });
                }
                user.password = hashNewPassword;
                await user.save();
                res.status(200).json({ message: "succesfully to change email.", data: user, error: false });
            }
            else {
                return res.status(401).json({ message: "access denied", data: null, error: true });
            }
        }
        catch (e) {
            console.log("error in deleteAcount funciton :", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    getPosts = async (req, res) => {
        try {
            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(404).json({ message: "user not found, please first login or register.", data: null, error: true });
            }
            const userPosts = await postModel.find({ userId: user._id }).sort({ createdAt: 1 });
            if (!userPosts) {
                return res.status(200).json({ message: "not posts yet.", data: [], error: false });
            }
            res.status(200).json({ message: "succesfully to get every your posts.", data: userPosts, error: false });
        }
        catch (e) {
            console.log("error in api getPosts : ", e);
            res.status(500).json({ message: "Internal server error ", data: null, error: true });
        }
    }
    getTheSelfPosts = async (req, res) => {
        try {
            if (!req.user) {
                req.user = null;
                return res.status(403).json({ message: "please register or login", error: true });
            }
            const findUser = await userModel.findById(req.user);
            if (!findUser) {
                return res.status(404).json({ message: "user not found ." });
            }
            const findPosts = await postModel.find({ userId: findUser._id });
            if (findPosts.length < 1 || findPosts.length == 0) {
                return res.status(200).json({ message: "ok", data: {} });
            }
            res.status(200).json({ message: "ok", data: findPosts });
        }
        catch (e) {
            console.log("getTheSelfePosts error : ", e);
            res.status(500).json({ message: "internal server error" });
        }
    }
}

module.exports = new Dashboard;