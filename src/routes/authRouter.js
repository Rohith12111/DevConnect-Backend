const express=require("express");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const bcrypt=require("bcrypt")
const authRouter=express.Router();


authRouter.post("/signup",async(req,res)=>{

    try{
        validateSignUpData(req)
        const {firstName,lastName,email,password}=req.body
        const hash=await bcrypt.hash(password,10)
        const user=new User({firstName,lastName,email,password:hash});
        const result=await user.save();
        const jwtToken=await user.getJWT()
        res.cookie("token",jwtToken,{expires: new Date(Date.now() + 8 * 3600000) })
        res.json({result})
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user)
        {
            throw new Error("Invalid Credentials")
        }
        const passwordMatch=await user.validatePassword(password)
        if(passwordMatch){ 
            const jwtToken=await user.getJWT()
            res.cookie("token",jwtToken,{expires: new Date(Date.now() + 8 * 3600000) })
            res.send(user)
        }   
        else{
            throw new Error("Invalid Credentials")
        }
    }catch(err)
    {
        res.status(400).send("ERROR: "+ err.message)
    }
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send("User logged out successfully..")

})


module.exports={authRouter}