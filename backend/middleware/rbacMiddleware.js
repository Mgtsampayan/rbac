import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';

// Rate limiting configuration
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
})

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies['auth-token'] || req.headers['authorization']?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check if user still exists and is not locked
        const user = await User.findById(decoded.userId)
        if (!user || user.isLocked) {
            return res.status(401).json({ message: 'User no longer valid' })
        }

        // Update last activity
        await User.findByIdAndUpdate(decoded.userId, {
            lastActivity: new Date(),
            $inc: { totalLogins: 1 }
        })

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

// Role-based middleware with granular permissions
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized access' })
        }
        next()
    }
}

// Permission-based middleware
const checkPermission = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user || !requiredPermissions.every(permission =>
            req.user.permissions.includes(permission)
        )) {
            return res.status(403).json({ message: 'Insufficient permissions' })
        }
        next()
    }
}

module.exports = { authLimiter, verifyToken, checkRole, checkPermission }