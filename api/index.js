import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

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

app.listen(PORT, () => {
    console.log(`\nThe server is running on port ${PORT}`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
