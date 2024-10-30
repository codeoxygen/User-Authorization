import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PORT } from './config.js';
import { connectDB, userCollection } from './db.js';
import authRoutes from './routes/auth.js';



const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});