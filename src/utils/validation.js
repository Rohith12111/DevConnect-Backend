const validateSignUpData=(req)=>{
    const {firstName,lastName,email,password}=req.body;

     if(!firstName || !lastName) {
        throw new Error("Name is not valid!!");
     }
}

module.exports={validateSignUpData}