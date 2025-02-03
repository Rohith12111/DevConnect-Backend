const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength: 4,
        maxLength:50,
        trim:true,

    },
    lastName: {
        type:String,
        trim:true
        
    },
    email:{
        type: String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Enter a valid email")
            }
        }
    },
    password:{
        type: String,
        required:true,
        validate(value)
        {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Please Enter a strong password")
            }
        }
    },
    age:{
        type: Number,
        min:18,
    },
    gender:{
        type: String,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value))
                throw new Error("Not a valid gender");
        },
    },
    photoUrl:{
        type:String,
        default:"https://pm1.aminoapps.com/7590/2f826749ea5931333d14d58e0b0ac81887c41df4r1-480-792v2_uhq.jpg",
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Enter a valid url");
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about of the user"
    },
    skills:{
        type:[String],
        validate(value)
        {
            if(value.length>5)
                throw new Error("Skills can't be more than 5")
        }
    }
},{timestamps:true})

userSchema.methods.getJWT= async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"DevConnect@myapp123",{expiresIn:"1d"})
    return token;
}

userSchema.methods.validatePassword=async function (userInputPassword){

    const user=this;
    const passwordMatch=await bcrypt.compare(userInputPassword,user.password);
    return passwordMatch;
}



const User=mongoose.model("User",userSchema);
module.exports={User}