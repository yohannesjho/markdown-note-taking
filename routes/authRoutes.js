const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')


//register a new user
router.post('/user/register',async (req,res)=>{
    const {userName, password} = req.body
    const user = new User({userName,password,createdAt:Date.now()})
    await user.save()
    const payload = {userId:user._id}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
    res.status(201).json({token})
    
})
//login the user
router.post('/user/login', async (req,res)=>{
    const {userName, password} = req.body
    const user = await User.findOne({userName})
    if(!user){return res.status(404).json({message:"user not found"})}
    const isMatch = bcrypt.compare(user.password,password)
    if(!isMatch){return res.status(404).json({message:"invalid credentials"})}
    const payload = {userId:user._id}
    const token = jwt.sign(payload,process.env.JWT_SERET,{expiresIn:'1h'})
    res.status(202).json({token})
})

module.exports = router