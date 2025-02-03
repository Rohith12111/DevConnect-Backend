const jwt=require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token) {
            return res.status(401).send("Please Login...")
        }
        
        const decodedMessage=await jwt.verify(token,"DevConnect@myapp123")
        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("Error No user found")
        }
        req.user=user;
        next();
        
    }catch(err){
        
        res.status(400).send("Error: "+err.message)
    }
}

module.exports={userAuth}