const express = require('express')
const multer = require('multer')
const marked = require('marked')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const noteRoutes = require('./routes/noteRoutes')

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api',noteRoutes)
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI).then((req,res)=>console.log('connected to db')).catch((e)=>console.log(e))

const storage = multer({
    destination: (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage });

app.listen(PORT , (req,res)=>{
    console.log('server is listening on port 5000')
})

