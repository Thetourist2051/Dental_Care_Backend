require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    const startTime = process.hrtime();

    res.on("finish", () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
        const statusCode = res.statusCode;

        const logMessage = `----
[${timestamp}] ${method} ${url}
Response Status : ${statusCode}
Response Time   : ${responseTime} ms
---`;

        console.log(logMessage);
    });

    next();
}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req?.cookies;
        console.log("token ---->", token);
        if (!token) {
            throw new Error("Token Not Found! Kindly Login Again :(");
        }
        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        const { _id } = decodedInfo;
        const decodedUser = await User.findById(_id);
        if (!decodedUser) {
            throw new Error("User not Found !");
        }
        req.user = decodedUser;
        next();
    } catch (err) {
        res.status(400).json({
            message: err?.message || "An Unknown Error Occured at userAuth !",
            state: -1,
        });
    }
};

module.exports = { requestLogger, userAuth };
