const express = require("express")
const app = express()

const authorise = (array)=>{
   return (req,res,next)=>{
    const role = req.body.role
    if(array.includes(role)){
        next()
    }
    else{
        res.send("Not authorised")
    }
   }
}

module.exports={authorise}