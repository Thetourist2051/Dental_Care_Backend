const moongose = require("mongoose")
const dotenv = require("dotenv");
dotenv?.config();


const connectDB = async ()=> {
    await  moongose.connect(process.env.MONGO_DB_URI+process.env.DB_NAME)
}


module.exports = { connectDB }
