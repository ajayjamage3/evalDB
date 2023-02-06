const jwt = require("jsonwebtoken")
const fs = require("fs")
const express = require("express")
const app = express()
const authorization  = (req,res,next)=>{
    const token = req.headers.authorization
    if(token){
        const blacklistData = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        if(blacklistData.includes(token)){
            res.send("Please login again")
        }else{
            jwt.verify(token,"ajay",(err,decode)=>{
                if(err){
                    res.send(err)
                }
                else{
                    console.log(decode)
                    const role = decode.userRole
                    req.body.role = role
                    next()
                }
            })
        }
    }else{
        res.send("Please login")
    }
}

module.exports = {authorization}