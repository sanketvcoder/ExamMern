import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { port } from './config/config.js';
import connectDB from './db/db.js';
import autRoute from './routes/AuthRoutes/authRoute.js';
import profileRoute from './routes/profileRoutes/profileRoute.js';
import adminRoute from './routes/AdminRoute/adminRoute.js';
import testRoute from './routes/TestRoute/testRoute.js';
import studentRoute from './routes/StudentRoutes/studentRoutes.js';

dotenv.config(); // Load .env variables

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth',autRoute)
app.use('/api/profile', profileRoute);
app.use('/api/admin',adminRoute)
app.use('/api/test', testRoute); 
app.use('/api', studentRoute);
// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1); // Stop server if DB connection fails
  });
