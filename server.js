const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes')
const path = require('path');
const auth = require('./routes/authRoutes')
const authenticateToken = require('./middlewares/auth')
const { connectToDatabase } = require('./db/db');
 

dotenv.config()
const app = express()
const corsOptions = {
    origin: [
      'https://markdown-front-end.vercel.app',
      'https://markdown-front-4uaf10nxn-yohannesjhos-projects.vercel.app/'   
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    credentials: true,  
  };
  app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000
connectToDatabase()
    .then(() => {
  
        app.use('/api',noteRoutes)
        app.use('/api/auth',auth)
        app.listen(PORT , (req,res)=>{
            console.log(`server is listening on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
    });
 

 
 



