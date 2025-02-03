const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { User } = require("../models/user");

const userRouter=express.Router();


userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const requests=await ConnectionRequestModel.find({toUserId:loggedInUser._id,status:"interested"}).populate("fromUserId",["firstName","lastName","age","gender","skills","about","photoUrl"])
        res.json({message:"Requests fetched successfully", requests}  )
    }catch(err)
    {
        res.status(400).send("ERROR: "+err.message)
    }

})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connections=await ConnectionRequestModel.find({
            status:"accepted",
            $or:[
                {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}
            ]
        }).populate('fromUserId', 'firstName lastName skills photoUrl age gender about')
        .populate('toUserId', 'firstName lastName skills photoUrl age gender about');
        
        const connectedUsers = connections.map(conn => 
            conn.fromUserId._id.toString() === loggedInUser._id.toString() 
              ? conn.toUserId 
              : conn.fromUserId
          );
      
          res.json({ success: true, connections: connectedUsers });
    }catch(err)
    {
        res.status(400).send("ERROR: "+err.message)
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user
        
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit= limit> 50? 50 :limit;
        const skip=(page-1)*limit;
        
        const myConnections=await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}
            ]
        })
        const hideConnections=new Set()
        myConnections.forEach(connection=>{
            hideConnections.add(connection.fromUserId.toString())
            hideConnections.add(connection.toUserId.toString())
        })
        const feed= await User.find({
            $and:[
                {_id: {$nin: Array.from(hideConnections)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select("_id firstName lastName about photoUrl skills gender").skip(skip).limit(limit)
        res.json({feed})

    }catch(err)
    {
       res.status(400).send("ERROR: "+err.message)
    }
})

module.exports=userRouter