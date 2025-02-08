const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel =require("../models/connectionRequest");
const requestRouter=express.Router();
const mongoose=require("mongoose");
const { User } = require("../models/user");

const sendEmail=require("../utils/sendEmail")


requestRouter.post("/request/:status/:userId",userAuth,async (req,res)=>{

    try{
        const fromUserId=req.user._id
        const toUserId=req.params.userId
        const status=req.params.status
        
        const user= await User.findById(toUserId)
        if(!user)
        {
            return res.status(400).send("ERROR: User not found")
        }
        const checkUsersPresent=await ConnectionRequestModel.findOne(
            { $or : 
                [ {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]}
        )
        if(checkUsersPresent){
            return res.status(400).json({message:"Invalid request"})
        }

        const ALLOWED_STATUS=["interested","ignored"];
        if(!ALLOWED_STATUS.includes(status))
        {
            return res.status(400).send("Invalid status type" + status)
        }
        const connectionRequest= new ConnectionRequestModel({fromUserId,toUserId,status})
        const data=await connectionRequest.save();
        
        res.json({message:"Connection Request Sent Successfully!!",data})

    }catch(err)
    {
        console.log(err)
        res.status(400).send("ERROR:" + err.message)
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth,async(req,res)=>{

    try{

        const loggedInUser=req.user;
        const status=req.params.status
        const requestId=req.params.requestId

        // Check requestId is valid
        if(!mongoose.Types.ObjectId.isValid(requestId)){
            return res.status(404).json({message:"Invalid RequestID"})
        }

        //Check status is valid
        const ALLOWED_STATUS=["accepted","rejected"]
        const isAllowed=ALLOWED_STATUS.includes(status)
        if(!isAllowed)
        {
           return res.status(400).json({message:"Invalid status"})
        }

        // Check requestId is present in DB
        const connectionRequest=await ConnectionRequestModel.findOne({_id:requestId, toUserId:loggedInUser._id, status:"interested"})
        if(!connectionRequest)
        {
           return res.status(404).json({message:"Connection request not found"})
        }

        connectionRequest.status=status;
        const data=await connectionRequest.save();

        res.json({message:`Request ${status}`, data} )


    }catch(err)
    {
        res.status(400).send("ERROR: "+ err.message)
    }

})



module.exports={requestRouter}