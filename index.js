const express = require("express")
const app = express()
app.use(express.json())
const {connection} = require("./config/db")
const {userRouter} = require("./routes/user.routes")

app.use("/",userRouter)


app.listen(4500,async()=>{
    try {
        await connection
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log("port running at 4500")
})