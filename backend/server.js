import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000'], credentials: true
    }
));
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});