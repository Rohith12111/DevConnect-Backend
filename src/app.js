const express=require("express");
const cookieParser=require("cookie-parser")
const {connectDB}=require("./config/database")
const {authRouter}=require("./routes/authRouter")
const {profileRouter}=require("./routes/profileRouter")
const {requestRouter}=require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");
const cors=require('cors')

const app=express();

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("App listening on port:3000")
    });
    console.log("DB connected successfully")
}).catch((err)=>{
    console.error("Data Base couldn't be connected!!")
});

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json(),cookieParser())
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use('/',userRouter)






