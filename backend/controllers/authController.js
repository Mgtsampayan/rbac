import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (request, response) => {
    const { username, password, role } = request.body;

    console.log('Register request received:', { username, role }); // Debug log

    try {
        // Check if required fields are present
        if (!username || !password || !role) {
            console.log('Missing required fields'); // Debug log
            return response.status(400).json({ message: 'Missing required fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('Password hashed successfully'); // Debug log

        // Create and save the user
        const user = new User({ username, password: hashedPassword, role });
        await user.save();

        console.log('User saved to database:', user); // Debug log

        response.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Debug log

        // Handle duplicate username error
        if (error.code === 11000) {
            return response.status(400).json({ message: 'Username already exists' });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return response.status(400).json({ message: error.message });
        }

        response.status(500).json({ message: 'Error registering user' });
    }
};

export const login = async (request, response) => {
    const { username, password } = request.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return response.status(404).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(404).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        response.status(200).json({ token });
    } catch (error) {
        response.status(500).json({ message: 'Error logging in user' });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.' });
    }
};