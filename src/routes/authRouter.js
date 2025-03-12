const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { fullname, email, address, age, password, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      email,
      address,
      age,
      password: passwordHash,
      gender,
    });
    await user.save();

    res.json({
      message: "You have successfully Signed up .",
      state: 1,
    });
  } catch (err) {
    res.status(400).json({
      message: "An Unknown Error Occured While Sign-up !",
      error: err?.message,
      state: -1,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
        state: -1,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Credentials do not match!",
        state: -1,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credentials do not match, try again :(",
        state: -1,
      });
    }

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: process.env.JWT_SECRET_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET_TOKEN,
      { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRY } // e.g., '7d' for 7 days
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `Welcome back, ${user.fullname}! :)`,
      state: 1,
      accessToken,
      refreshToken,
      userInfo: user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "An unknown error occurred during login.",
      error: err.message,
      state: -1,
    });
  }
});

authRouter.post("/validate-token", async (req, res) => {
  try {
    const { authToken } = req.body;
    if (!authToken) {
      throw new Error("Token Not Found! Kindly Login Again :(");
    }
    const decodedInfo = jwt.verify(authToken, process.env.JWT_SECRET_TOKEN);
    const { _id } = decodedInfo;
    const decodedUser = await User.findById(_id);
    if (!decodedUser) {
      throw new Error("Not a valid token !");
    }
    res.status(200).json({
      state: 1,
      message: "Token Validated",
      userInfo: decodedUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error?.message || "An Unknown Error Occured at Validating Token !",
      state: -1,
    });
  }
});

module.exports = { authRouter };
