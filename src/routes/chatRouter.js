const express=require("express")
const { userAuth } = require("../middlewares/auth")
const Chat = require("../models/chat")
const ConnectionRequestModel = require("../models/connectionRequest")
const chatRouter=express.Router()


chatRouter.get("/chat/:targetUserId",userAuth,async(req,res)=>{

    try {
        const {targetUserId}=req.params
        const loggedInUser=req.user
        
        let connection=await ConnectionRequestModel.find({
            status:"accepted",
            $or:[{fromUserId:loggedInUser._id,toUserId:targetUserId},{fromUserId:targetUserId,toUserId:loggedInUser._id}]
        })
        if(connection.length===0) {
            throw new Error("Unauthorized request")
        }

        let messages= await Chat.findOne({
            participants:{
                $all:[loggedInUser._id,targetUserId]
            }
        }).populate({
            path: "messages.senderId",
            select:"firstName lastName"
        })  

        if(!messages)
        {
            messages=new Chat({
                participants:[loggedInUser._id,targetUserId],
                messages:[]
            })
            await messages.save();
        }
        res.json({textMessages:messages})

    } catch (error) {
        res.status(400).send("Error: "+ error.message)
    }

})


module.exports=chatRouter