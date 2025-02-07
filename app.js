const dotenv = require('dotenv');
dotenv?.config();

const port = process.env.PORT
const express = require("express");

const app = express();

app.use("/hello",(req,res)=>{
    console.log("geesahdfashdgad")
    res.send('Hello from Server34434')
})

app.use("/",(req,res)=>{
    res.send('Hello from Server')
})


app.listen(port, ()=>[
    console.log('Server is up and running in Port -> ',port)
])




