const dotenv = require("dotenv");
dotenv?.config();
const { requestLogger } = require("./src/middleware");
const express = require("express");
const { connectDB } = require("./src/config/database.js");
const User = require("./src/models/user.js");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const app = express();
const { routes } = require("./src/routes");

app.use(express.json());
app.use(cookieParser());
app.use("/", requestLogger);

app.use(require("./src/routes"));

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
