const mongoose=require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://krohithreddyk1:JZnWLvHKU1v13xiC@cluster0.o616m.mongodb.net/devConnect?retryWrites=true&w=majority&appName=Cluster0")                
}

module.exports={
    connectDB
}