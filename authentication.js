require("dotenv").config()
const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")

app.use(express.json())

let refreshTokens=[]

app.post("/token",(req,res)=>{
    let refreshToken =req.body.token
    if(refreshToken==null){
        res.status(401).send("Forbidden")
    }
    if(!refreshTokens.includes(refreshToken)){
        res.status(403).send("User not authenticated")
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err){
            res.status(403).send("User not authenticated")
        }
        const accessToken=generateToken({name:user.name})
        res.json({accessToken:accessToken})
      
    })
   
})

app.delete("/logout",(req,res)=>{

    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
    res.status(204).send("Succesfully logout from the session")
    
})





app.post("/login",(req,res)=>{
    const username=req.body.username
    const user={name:username}
    const accessToken=generateToken(user)
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken:accessToken,refreshToken:refreshToken})
    
})
function generateToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15s"})
}


app.listen(4000,()=>{
    console.log("Server is up and running on port 4000");
})