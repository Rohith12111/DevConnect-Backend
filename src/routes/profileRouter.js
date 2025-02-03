const express=require("express");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const bcrypt=require("bcrypt")
const validator=require("validator")


const profileRouter=express.Router();

profileRouter.get("/profile",userAuth,async(req,res)=>{

    try{
        const user= req.user;
        res.send(user)
    }catch(err){
        res.status(400).send("Error "+ err.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

    try{
        const loggedInUser=req.user;
        
        const result=await User.findByIdAndUpdate({_id:loggedInUser._id},{...req.body},{runValidators:true,returnDocument:'after'})
        res.json({result})
    }
    catch(err){
        res.status(400).send("Error: "+ err.message)
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{

    try{

        const loggedInUser=req.user;
        const {email,password}=req.body
        if(!validator.isStrongPassword(password))
        {
            throw new Error("Please provide a strong Password")
        }
        const newPasswordHash=await bcrypt.hash(password,10);
        const result=await User.findByIdAndUpdate({_id:loggedInUser._id},{password:newPasswordHash},{runValidators:true})
        res.send("Password Updated Successfully")

    }catch(err){
        res.status(400).send("Error:" + err.message)
    }

})

module.exports={profileRouter}