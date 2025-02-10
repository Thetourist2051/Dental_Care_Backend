const dotenv = require("dotenv");
dotenv?.config();
const {requestLogger,protectedAuth} = require('./src/Middleware')

const port = process.env.PORT;
const express = require("express");

const app = express();

app.use('/user',requestLogger);

app.use('/protected', protectedAuth)

app.use(
  "/user",
  (req, res, next) => {
    console.log("In the First Request Handler")
    next();
  },
  (req, res) => {
    console.log("In the Second Request Handler")
    res.send("In the next block");
  }
);

app.use('/protected/:id', (req, res) => {
    console.log("Requested ID:", req.params.id);
    res.send({"message":"Valid Response ID"});
});


// This Route will match all the API calls (it can be GET, POST, PUT, PATCH, DELETE)
// app.use("/test", (req, res) => {
//   res.send("Test From test Route");
// });

app.listen(port, () => [
  console.log("Server is up and running in Port -> ", port),
]);
