import express from 'express';
import authController from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
const router = express.Router();

// Rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts, please try again later'
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected routes
// router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

// Admin routes
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;