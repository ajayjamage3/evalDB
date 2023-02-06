const mongoose = require("mongoose")

const userScema = mongoose.Schema({
    name:String,
    age:Number,
    role:String,
    email:String,
    pass:String
})

const UserModel = mongoose.model("users",userScema)

module.exports = {
    UserModel
}