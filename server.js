const express = require('express')
const dotenv = require('dotenv')
const noteRoutes = require('./routes/noteRoutes')
const path = require('path');
const auth = require('./routes/authRoutes')
const authenticateToken = require('./middlewares/auth')
const { connectToDatabase } = require('./db/db');
 

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectToDatabase()
    .then(() => {
        // Start the server once the DB connection is successful
        app.use('/api',authenticateToken,noteRoutes)
        app.use('/auth',auth)
        app.listen(process.env.PORT , (req,res)=>{
            console.log('server is listening on port 5000')
        })
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
    });
 

 
 



