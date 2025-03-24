const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../../middleware/index.js");
const User = require('../../models/user.js');

profileRouter.get("/fetch-profile", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      data: req?.user,
      message: "Profile Fetched Successfully .",
      state: 1,
    });
  } catch (err) {
    res.status(209).json({
      error: `An Unknown Error Occured in Fetching Profile !`,
      message: err?.message,
      state: 0,
    });
  }
});

profileRouter.put("/update-profile", userAuth, async (req, res) => {
  try {
    const { _id } = req?.user;
    const requesteduser = req?.body;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      requesteduser,
      { new: true, runValidators: true }
    );
    if(updatedUser){
      res.status(200).json({
        updateduser: updatedUser,
        message: "Profile Updated Successfully .",
        state: 1,
      });
    }else{
      res.status(400).json({
        message: "UserId is not mapped to anyone !",
        state: -1,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured in Update-Profile API !`,
      message: err?.message,
      state: -1,
    });
  }
});

module.exports = { profileRouter };
