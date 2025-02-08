const cron=require('node-cron')
const ConnectionRequestModel = require('../models/connectionRequest')
const { startOfDay, subDays, endOfDay } = require('date-fns')
const sendEmail=require("./sendEmail")

cron.schedule('0 0 1 * *',async()=>{

    // Restart the server everytime you test the cron job
    try{

        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const connectionList=await ConnectionRequestModel.find({
            status:"interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        const emailList=[...new Set(connectionList.map(conn=>conn.toUserId.email))]
        
        for(const email of emailList)
        {
            try{
                const res=await sendEmail.run("New Request from "+email,"Hello Dev, Hope you are doing good, Check out your new connection request")
            }catch(error)
            {
                console.log(error)
            }
        }
        
    }catch(err)
    {
        console.log(err)
    }
})