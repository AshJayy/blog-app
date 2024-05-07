import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from "cookie-parser";

dotenv.config()

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("MongoDB is connected");
})
.catch(err => {
    console.log(err);
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`\nThe server is running on port ${PORT}`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})