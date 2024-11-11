const jwt = require('jsonwebtoken')

const authenticateToken = (req,res,token)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.status(401).json({message:"no token provided"})
    
    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
         if(err) return res.status(403).json({message:"invalid token"})
        req.user = user
        next()
    })
}

module.exports = authenticateToken