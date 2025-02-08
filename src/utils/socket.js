const crypto=require("crypto")
const socket=require("socket.io");
const Chat = require("../models/chat");
const { User } = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

const generateRoomId=(userId,targetUserId)=>{
    const room=[userId,targetUserId].sort().join("_");
    const hash=crypto.createHash("sha256").update(room).digest('hex')
    return hash;
}


const initializeSocket=(server)=>{

    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173", 
        },
    })
    
    io.on("connection",(socket)=>{

        socket.on("joinChat",({userId,targetUserId,firstName})=>{
           
            const hash=generateRoomId(userId,targetUserId);
            socket.join(hash)
        })

        socket.on("sendMessage",async({firstName,lastName,userId,targetUserId,text})=>{
           
            try{    

                let connection=await ConnectionRequestModel.find({
                    status:"accepted",
                    $or:[{fromUserId:userId,toUserId:targetUserId},{fromUserId:targetUserId,toUserId:userId}]
                })
    
                if(connection.length===0) {
                    throw new Error("Unauthorized request")
                }
    
                const room=generateRoomId(userId,targetUserId)
                let chat=await Chat.findOne({
                    participants: {
                        $all: [userId,targetUserId]
                    }
                })
                if(!chat) {
                    chat = new Chat({
                      participants: [userId, targetUserId],
                      messages: [],
                    });
                }
                chat.messages.push({senderId:userId,text})
                await chat.save();
                io.to(room).emit("messageReceived",{ firstName, lastName, text})
            }catch(error)
            {
                console.log(error.message)
            }
        })

        socket.on("disconnect",()=>{})

    })
    
}


module.exports=initializeSocket