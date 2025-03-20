const express = require("express");
const router = express.Router();

const { authRouter } = require("./authRouter/authRouter");
const { profileRouter } = require("./profileRouter/profileRouter");
const { userRouter } = require("./userRouter/userRouter");

router.use(authRouter);
router.use(profileRouter);
router.use(userRouter);

module.exports = router;
