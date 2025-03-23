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
    mobileno: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Mobile number must be exactly 10 digits.",
      },
    },
    emergencyContact: {
      type: String,
      required: false,
      maxlength: 100,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    bloodgroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"],
      required: false,
      default: "Unknown",
    },
    medicalHistory: {
      type: String,
      required: false,
      maxlength :200,
    },
    currentMedications: {
      type: String,
      required: false,
      maxlength :200,
    },
    bloodPressure: {
      type: String,
      required: false,
      maxlength: 100,
      trim: true,
    },
    alcoholConsumption: {
      type: String, 
      enum: ["Yes", "No"],
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
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
