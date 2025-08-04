import dotenv from 'dotenv';
dotenv.config();
export const port = process.env.PORT || 3000;
export const mongoURI = process.env.MONGO_URI 
export const jwtSecret = process.env.JWT_SECRET
export const nodeEnv = process.env.NODE_ENV || 'development';
export const user = process.env.smtp_use
export const pass = process.env.smtp_pass

export const senderEmail = process.env.sender_email