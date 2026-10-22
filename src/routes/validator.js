const {body , validationResult} = require("express-validator");

//for validation data:
class Validator {
    validation = (req, res , next)=>{
        //To check for an error
        const result = validationResult(req);
        if(!result.isEmpty()){
            res.status(400).json({message : "bad request" , data : {}});
            return;
        }
        next();
    }
    registerValidate = ()=>{
        //To check the fields
        return [
            body("name").notEmpty().withMessage("invalid name") ,
            body("email").isEmail().withMessage("invalid email") ,
            body("password").notEmpty().withMessage("invalid password")
        ];
    }
    loginValidate = ()=>{
        //To check the fields
        return [
        body("email").isEmail().withMessage("invalid email") ,
        body("password").notEmpty().withMessage("invalid password")
    ];
    }
}

module.exports = new Validator;