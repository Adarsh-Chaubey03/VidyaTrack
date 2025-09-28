import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    imageUrl: user.imageUrl,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Educator login with specific credentials
// @route   POST /api/auth/educator-login
// @access  Public
export const educatorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for specific educator credentials
        if (email === 'teacher@gmail.com' && password === '12345678') {
            // Check if educator user exists, if not create one
            let educator = await User.findOne({ email });
            
            if (!educator) {
                educator = await User.create({
                    name: 'The Educator',
                    email: 'teacher@gmail.com',
                    password: '12345678',
                    role: 'educator',
                    imageUrl: 'https://via.placeholder.com/150'
                });
            } else if (educator.role !== 'educator') {
                // Update role if user exists but doesn't have educator role
                educator.role = 'educator';
                await educator.save();
            }

            res.json({
                success: true,
                message: 'Educator login successful',
                data: {
                    _id: educator._id,
                    name: educator.name,
                    email: educator.email,
                    role: educator.role,
                    imageUrl: educator.imageUrl,
                    token: generateToken(educator._id)
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid educator credentials'
            });
        }
    } catch (error) {
        console.error('Educator login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/educator-login', educatorLogin);
router.get('/me', protect, getMe);

export default router;

