import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate, authorize, authLimiter } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.put('/profile', authenticate, authController.updateProfile);

// Admin route to create new users with specific roles
router.post('/admin/register', authenticate, authorize('admin'), authController.createAdminUser);

router.get('/users', authenticate, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;