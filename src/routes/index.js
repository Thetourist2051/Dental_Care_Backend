const express = require("express");
const router = express.Router();

const { authRouter } = require("./authRouter/authRouter");
const { profileRouter } = require("./profileRouter/profileRouter");
const { userRouter } = require("./userRouter/userRouter");
const { mailRouter } = require("./mailRouter/mailRouter");

router.use(authRouter);
router.use(profileRouter);
router.use(userRouter);
router.use(mailRouter);

module.exports = router;
