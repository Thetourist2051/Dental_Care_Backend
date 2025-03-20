const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../../middleware/index.js");

profileRouter.get("/fetch-profile", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      data: req?.user,
      message: "Profile Fetched Successfully .",
      state: 1,
    });
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured in Profile API !`,
      message: err?.message,
      state: -1,
    });
  }
});

module.exports = { profileRouter };
