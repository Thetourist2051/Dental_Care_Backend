const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    dob: {
      type: Date,
      required: false,
      validate: {
        validator: validateDOB,
        message: "Invalid Date of Birth",
      },
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
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
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
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
  minDOB.setFullYear(minDOB.getFullYear() - 10);
  return dob <= minDOB;
}
