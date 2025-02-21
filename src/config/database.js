const moongose = require("mongoose")


const connectDB = async ()=> {
    await  moongose.connect('mongodb+srv://thetourist2051:Afridi150299@nodejscluster.grfft.mongodb.net/DentalPatientsDB')
}


module.exports = { connectDB }
