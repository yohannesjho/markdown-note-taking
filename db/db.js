const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectToDatabase() {
    try {
      
        await client.connect();
        console.log("Connected to MongoDB");

        
        db = client.db("mark-down-app");  

        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
}

// Function to get the database instance
function getDb() {
    if (!db) {
        throw new Error("Database not connected. Call connectToDatabase first.");
    }
    return db;
}

module.exports = { connectToDatabase, getDb };
