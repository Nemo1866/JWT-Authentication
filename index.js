require("dotenv").config()
const express=require("express")
const app=express()
const jwt=require("jsonwebtoken")

app.use(express.json())

let bio=[{
    username:"naeem",
    bio:"to be a node.js Developer"
},{
    username:"saad",
    title:"to be a fullstack developer"
}]
app.get("/bio",authenticateToken,(req,res)=>{
    res.json(bio.filter(bio=>bio.username===req.user.name))
})


function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(" ")[1]
    if(token == null) return res.status(401).send("User Not Found")

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send("User Not Authenticated")
     
        req.user=user
        next()
        
    })

}


app.listen(3000,()=>{
    console.log("Server is up and running on port 3000");
})