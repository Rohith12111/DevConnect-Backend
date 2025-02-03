const mongoose=require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://krohithreddyk1:jJ2PV7Y1UsS7fXIJ@cluster0.o616m.mongodb.net/devConnect?retryWrites=true&w=majority&appName=Cluster0")                
}

module.exports={
    connectDB
}