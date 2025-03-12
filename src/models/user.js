const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      minlength: 5,
      maxlength: 75,
      validate: {
        validator: validateEmail,
        message: "Invalid Email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      required: true,
      maximum:100,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 250,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateDOB(dob) {
  const minDOB = new Date();
  minDOB.setFullYear(minDOB.getFullYear() - 0);
  return dob <= minDOB;
}
