import { MongoClient } from 'mongodb';
import { MONGO_URI, DATABASE, COLLECTION } from './config.js';

const client = new MongoClient(MONGO_URI);
let userCollection;

const connectDB = async () => {
    try {
        await client.connect();
        const database = client.db(DATABASE);
        userCollection = database.collection(COLLECTION);
        console.log("Connected to MongoDB Successfully!");
    } catch (error) {
        console.log('Error connecting to MongoDB!', error);
    }
};

export { connectDB, userCollection };
