const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status:{
        type:String,
        required: true,
        enum:{
            values: ["accepted","ignored","rejected","interested"],
            message: `{VALUE} is not supported`
        }
    }
},{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    if(this.toUserId.equals(this.fromUserId))
    {
        throw new Error("Cannot send a connection request to yourself!!")
    }
    next();
})

connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequestModel=mongoose.model("ConnectionRequestModel",connectionRequestSchema);
module.exports=ConnectionRequestModel;