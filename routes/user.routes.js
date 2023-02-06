const express = require("express")
const userRouter = express.Router()
const {UserModel} = require("../models/user.model")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const {authorization} = require("../middlewares/auth.mid")
const {authorise} = require("../middlewares/authorise.mid")


userRouter.get("/",(req,res)=>{
    res.send(welcome)
})


userRouter.post("/signup",async(req,res)=>{
    const {name,age,role,email,pass} = req.body
    const user = new UserModel({name,age,role,email,pass})
    await user.save()
    res.send("Signup succesfull")
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass} = req.body
    try {
        const user = await UserModel.find({email})
        if(user.length>0){
            if(user.pass == pass){
                const token = jwt.sign({userId:user[0]._id,userRole:user[0].role},"ajay",{expiresIn:60})
                const refreshtoken = jwt.sign({userId:user[0]._id,userRole:user[0].role},"refresh",{expiresIn:300})
                res.send({"msg":"Logged in",token,refreshtoken})
            }else{
                res.send("Wrong password")
            }
        }
        else{
            res.send("Wrong Username")
        }
    } catch (error) {
        console.log(error)
    }    
})

userRouter.get("/logout",(req,res)=>{
    const token = req.headers.authorization
    const blacklistData = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklistData.push(token)
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklistData))
    res.send("Logout succesfully")
})

userRouter.get("/refresh",(req,res)=>{
    const refreshtoken = req.headers.authorization
    if(!refreshtoken){
        res.send("Please login first")
    }
    else{
        jwt.verify(refreshtoken,"refresh",(err,decode)=>{
            if(err){
                res.send(err)
            }
            else{
                const token = jwt.sign({userId:decode.userId,userRole:decode.userRole},"ajay",{expiresIn:60})
                res.send(token)
            }
        })
    }
})

userRouter.get("/goldrate",authorization,(req,res)=>{
    res.send("Here is your goldrate")
})

userRouter.get("/userstats",authorization,authorise(["manager"]),(req,res)=>{
    res.send("Here is your userstats")
})

module.exports={userRouter}

