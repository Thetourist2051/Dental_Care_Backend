const express = require("express");
const router = express.Router();

const { authRouter } = require("./authRouter");
const { profileRouter } = require("./profileRouter");

router.use(authRouter);
router.use(profileRouter);

module.exports =  router ;
