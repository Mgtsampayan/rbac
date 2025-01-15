import User from'../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ $or: [{ email }, { username }] });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                password,
                role: role || 'student'
            });

            // Generate token
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(201).json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check for user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check if account is locked
            if (user.isLocked && user.lockUntil > Date.now()) {
                return res.status(423).json({
                    message: 'Account is locked. Please try again later.'
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                await user.handleFailedLogin();
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Reset failed attempts on successful login
            user.failedLoginAttempts = 0;
            user.isLocked = false;
            user.lastLogin = Date.now();
            await user.save();

            // Generate token
            const token = generateToken(user._id);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Logout user
    logout: (req, res) => {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'Logged out successfully' });
    },

    // Get current user
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const updates = req.body;
            delete updates.password; // Prevent password update through this route

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { ...updates, profileComplete: true },
                { new: true, runValidators: true }
            ).select('-password');

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default authController;