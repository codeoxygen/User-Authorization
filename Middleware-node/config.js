import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 3000;
export const DATABASE = process.env.DATABASE;
export const COLLECTION = process.env.COLLECTION;
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;