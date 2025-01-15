import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { register, login, getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware(), getUser);


export default router;