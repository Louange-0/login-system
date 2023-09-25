import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import studentRoute from './routes/studentRoute.js';
import teacherRoute from './routes/teacherRouter.js'
import userRoute from './routes/userRoute.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname=dirname(__filename)
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

// Add middleware to parse JSON request bodies
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);
const conn = mongoose.connection;

conn.once('open', () => {
  console.log('Successfully connected to the database');
});

conn.on('error', () => {
  console.log('Connection to the database failed');
});

// Define routes after initializing the app
app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/students', studentRoute);
app.use('/teachers',teacherRoute);
app.use('/users',userRoute)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
