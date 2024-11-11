const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const noteRoutes = require('./routes/noteRoutes')
const path = require('path');
const auth = require('./routes/authRoutes')
const authenticateToken = require('./middlewares/auth')

 

dotenv.config()
const PORT = 5000;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api',authenticateToken,noteRoutes)
app.use('/auth',auth)

mongoose.connect(process.env.MONGO_URI).then((req,res)=>console.log('connected to db')).catch((e)=>console.log(e))

app.listen(PORT , (req,res)=>{
    console.log('server is listening on port 5000')
})

