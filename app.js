const dotenv = require("dotenv");
dotenv?.config();
const { requestLogger, userAuth } = require("./src/middleware");
const express = require("express");
const { connectDB } = require("./src/config/database.js");
const User = require("./src/models/user.js");
const bcrypt = require("bcrypt");
const ValidateSignupData = require("./src/utils/validation/validation.js");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/',requestLogger);

app.post("/signup", async (req, res) => {
  try {
    ValidateSignupData(req);

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
      message: "Data Saved Successfully .",
      state: 1,
    });
  } catch (err) {
    res.status(400).json({
      message: "An Unknown Error Occured !",
      error: err?.message,
      state: -1,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req?.body;
    console.log(`Email`, email, password);
    if (validator.isEmail(email)) {
      const user = await User.findOne({ email: email });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const jwttoken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn : process.env.JWT_SECRET_EXPIRY });
          res.cookie("token", jwttoken);
          res.json({
            message: `Welcome Back ${user.firstname} :)`,
            state: 1,
          });
        } else {
          res.status(401).json({
            message: "Credentials do not match, Try again :(",
            state: -1,
          })
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req.user)
    res.status(200).json({
      data: req?.user,
      message : 'Logged-in User Is',
      state : 1
    })
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured in ${req.url}`,
      message: err?.message,
      state: -1,
    });
  }
})

app.get("/users", async (req, res) => {
  try {
    const list = await User.find();
    res.status(200).json({
      data: list,
      message: `All Users Data Fetch Successfully .`,
      state: 1,
    });
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured`,
      message: err?.message,
      state: -1,
    });
  }
});

app.delete("/user/:deleteId", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.deleteId);
    if (deleteUser) {
      res.status(200).json({
        message: `Users Deleted Successfully .`,
        state: 1,
      });
    } else {
      res.status(404).json({
        message: `UserId does not mapped to anyone !`,
        state: -1,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured`,
      message: err?.message,
      state: -1,
    });
  }
});

app.patch("/user/:updateId", async (req, res) => {
  try {
    const userData = req?.body;
    const updateUser = await User.findByIdAndUpdate(
      req?.params?.updateId,
      userData,
      { new: true, runValidators: true }
    );

    if (updateUser) {
      res.status(200).json({
        message: `User Updated Successfully .`,
        state: 1,
      });
    } else {
      res.status(404).json({
        message: `UserId does not mapped to anyone !`,
        state: -1,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `An Unknown Error Occured`,
      message: err?.message,
      state: -1,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log("Server is up and running in Port -> ", port);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
