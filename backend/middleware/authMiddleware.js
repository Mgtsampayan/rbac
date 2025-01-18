import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import rateLimit from 'express-rate-limit';

// Rate limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts, please try again later'
});

export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookie or header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists and is active
        const user = await User.findById(decoded.id).select('-password');
        if (!user || user.status !== 'active') {
            return res.status(401).json({ message: 'User not found or inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Role-based authorization
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Not authorized to access this route'
            });
        }
        next();
    };
};

// Permission-based authorization (Needs user.permissions to be populated)
export const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Not authorized to perform this action'
            });
        }
        next();
    };
};