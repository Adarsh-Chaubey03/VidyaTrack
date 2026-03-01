import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── General authentication middleware ────────────────────
export const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        req.tokenPayload = decoded; // { id, role, email }
        next();
    } catch (error) {
        console.log('❌ Auth middleware - Error:', error.message);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
}

// ─── Student-route guard ──────────────────────────────────
// Ensures the session is student-scoped (JWT role = 'user')
// Use AFTER protect middleware.
export const protectStudent = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        // Check JWT role claim — must be student-scoped
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'user') {
                return res.status(403).json({
                    success: false,
                    message: 'This endpoint requires a student session. Please log in as Student.'
                });
            }
        }

        // Verify activeRole matches
        if (req.user.activeRole && req.user.activeRole !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Your active role is not Student. Please switch roles first.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// ─── Educator-route guard ─────────────────────────────────
// Defense-in-depth: checks DB role + approval + JWT role claim + activeRole
// Use AFTER protect middleware.
export const protectEducator = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        // DB-level checks
        if (req.user.role !== 'educator' || !req.user.educatorApproved) {
            return res.status(403).json({ success: false, message: 'Unauthorized Access - Approved Educator role required' });
        }

        // Verify JWT role claim matches (prevents using a student-scoped token on educator routes)
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'educator') {
                return res.status(403).json({
                    success: false,
                    message: 'Session not authorized for educator access. Please log in as educator.'
                });
            }
        }

        // Check activeRole — ensures single-role enforcement
        if (req.user.activeRole && req.user.activeRole !== 'educator') {
            return res.status(403).json({
                success: false,
                message: 'Your active role is not educator. Please switch roles first.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


