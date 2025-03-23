const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, 
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendRegistrationEmail = async (username, useremail) => {
  const mailOptions = {
    from: '"Dental Care 🦷" thetourist2051@gmail.com',
    to: useremail,
    subject: "Welcome to Dental Care!",
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2d89ef;">Welcome to Dental Care, ${username}! 🦷</h2>
            <p>Thank you for registering with <strong>Dental Care</strong>. We are excited to have you on board!</p>
            <p>Our team is dedicated to providing you with the best dental services and keeping your smile bright.</p>
            <hr>
            <p style="font-size: 14px; color: #555;">If you have any questions, feel free to <a href="mailto:support@dentalcare.com">contact us</a>.</p>
            <p style="font-weight: bold;">Happy Smiling! 😊</p>
          </div>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${useremail}`);
  } catch (error) {
    throw new Error(`Error sending email: ---> ${error}`)
  }
};


module.exports = sendRegistrationEmail ;