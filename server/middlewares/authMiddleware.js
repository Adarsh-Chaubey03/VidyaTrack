import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// General authentication middleware
export const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('❌ Auth middleware - Error:', error.message);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
}

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (req.user.role !== 'educator') {
            return res.status(403).json({ success: false, message: 'Unauthorized Access - Educator role required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


