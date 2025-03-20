const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../../middleware/index.js");
const User = require("../../models/user.js");

userRouter.get("/all-users", userAuth, async (req, res) => {
  try {
    const list = await User.find();
    res.status(200).json({
      state: 1,
      message: "All Users Fetched Successfully .",
      userlist: list,
    });
  } catch (error) {
    res.status(400).json({
      message: "An Unknown Error Occured In UserRouter !",
      error: err?.message,
      state: -1,
    });
  }
});

module.exports = { userRouter };
