const express = require("express");
const authRouter = express.Router();
const validateSignupData = require("../utils/validation/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstname, lastname, dob, email, password, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      dob: new Date(dob),
      email,
      password: passwordHash,
      gender,
    });
    await user.save();

    res.json({
      message: "Signed-up Successfully .",
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
    const { email, password } = req?.body;
    if (validator.isEmail(email)) {
      const user = await User.findOne({ email: email });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const jwttoken = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: process.env.JWT_SECRET_EXPIRY }
          );
          res.cookie("token", jwttoken);
          res.json({
            message: `Welcome Back ${user.firstname} :)`,
            state: 1,
          });
        } else {
          res.status(401).json({
            message: "Credentials do not match, Try again :(",
            state: -1,
          });
        }
      } else {
        res.status(401).json({
          message: "Credentials do not match !",
          state: -1,
        });
      }
    } else {
      throw new Error("Please Enter a Valid EmailId");
    }
  } catch (err) {
    res.status(400).json({
      message: "An Unknown Error Occured While Login !",
      error: err?.message,
      state: -1,
    });
  }
});

module.exports = { authRouter };
