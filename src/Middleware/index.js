const jwt = require("jsonwebtoken")
require("dotenv").config()

const requestLogger = (req, res, next)=>{
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

const userAuth = (req, res, next)=>{
    console.log("In user Auth")
    const token = "Afridi"
    if(token === process.env.JWT_TOKEN){
        next()
    }else{
        res.status(401).json({status : -1, message : "Unauthorized User !!!"})
    }
}

const protectedAuth = (req, res, next)=>{
    console.log('In Protected Auth')
    const token = "afridi"
    if(token === process.env.JWT_TOKEN ){
        next();
    }else{
        res.status(401).json({state :-1,message:"Does not have enough permission to this protected Path!"})
    }
}


module.exports = { requestLogger, protectedAuth }