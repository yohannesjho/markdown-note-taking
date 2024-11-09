const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{type:String , required:true},
    password:{type:String, required:true},
    createdAt:{type:Date, default:date.now}
})

module.exports = mongoose.model('User', userSchema)