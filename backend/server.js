// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    credentials: true // Allow cookies and credentials
}));
app.use(cookieParser());
app.use(express.json());

// Rate limiting
import rateLimit from 'express-rate-limit'; // Already imported
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);

// Sample /api/auth/current-user route (for testing)
// app.get('/api/auth/current-user', (req, res) => {
//     // Example response
//     res.json({ user: { id: '123', username: 'example', email: 'example@example.com' } });
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));