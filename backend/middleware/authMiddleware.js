import jwt from 'jsonwebtoken';

export const authMiddleware = (roles) => (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Use SECRET_KEY here
        req.user = decoded;

        if (roles && !roles.includes(decoded.role)) { // Correctly check if roles exist and includes the user role
            return res.status(403).json({ error: 'Access Denied. You do not have the required role.' });
        }

        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid Token' });
    }
};