const express = require("express");
const mailRouter = express.Router();
const sendRegistrationEmail = require("../../utils/nodemailer/nodemailer.js");

mailRouter.post("/send-mail", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required!" });
  }
  try {
    await sendRegistrationEmail(name, email);
    res
      .status(200)
      .json({
        message: "Registration successful! Check your email.",
        state: 1,
      });
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured While sending Email !`,
      message: err?.message,
      state: -1,
    });
  }
});

module.exports = { mailRouter };
