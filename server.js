const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const noteRoutes = require('./routes/noteRoutes')
 

dotenv.config()
const PORT = 5000;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api',noteRoutes)

mongoose.connect(process.env.MONGO_URI).then((req,res)=>console.log('connected to db')).catch((e)=>console.log(e))

app.listen(PORT , (req,res)=>{
    console.log('server is listening on port 5000')
})

