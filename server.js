const express = require('express')
const { MongoClient, ServerApiVersion } = require("mongodb");
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

const client = new MongoClient(process.env.MONGO_URI,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
); 

async function run(){
    try {
        await client.connect()
        await client.db("admin").command({ping:1})
        console.log('your are connected to mongodb')

    }finally{
       await client.close()
    }
}

run().catch(console.dir)

 

app.listen(PORT , (req,res)=>{
    console.log('server is listening on port 5000')
})

