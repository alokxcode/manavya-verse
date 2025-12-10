import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/db.js';
import authRoutes from './route/authRoutes.js';
import cors from 'cors'
import chatRoutes from './route/chatRoutes.js';

const app = express();

// Load environment variables
dotenv.config();

// Enable CORS for frontend origin and allow credentials
app.use(cors({
    origin: "http://localhost:5173", // or whatever port Vite is running
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you’re sending cookies/auth headers
  }))

// Parse incoming JSON requests
app.use(express.json());
// Parse cookies from requests
app.use(cookieParser());

// Mount authentication and chat routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Start server and connect to database
const PORT = process.env.PORT
app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on http://localhost:${PORT}`)
})