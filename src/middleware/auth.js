const config = require("config");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models");

async function Auth(req, res , next) {
    try {
        const auth = req.headers["auth-token"];
        const token = auth && auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

        if (!auth || !token) {
            res.status(403).json({ message: "not found", data: {}, error: "not found this page" });
            return;
        }

        const decode = jwt.verify(token, config.get("jwtKey"));
        req.user = decode.userId;
        const checkUser = await userModel.findById(req.user);

        if (!checkUser) {
            console.log("there is not user in the data base");
            return;
        }
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized", data: {}, error: "Token not provided or invalid" });
    }
};

//You can use this middleware to protect the routes you want;

module.exports = Auth;