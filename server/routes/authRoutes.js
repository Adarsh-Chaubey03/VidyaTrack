import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ─── JWT Helper ───────────────────────────────────────────
// Payload: { id, role, email } — role = session-scoped role
const generateToken = (id, role, email) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// ─── Register ─────────────────────────────────────────────
// POST /api/auth/register  — always creates a student ('user') account
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // SECURITY: Never accept role from client — always default to 'user'
        // Educator/admin roles are assigned server-side only (seed script, admin panel)
        const role = 'user';

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            // New registrations always start as student
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    activeRole: user.activeRole || 'user',
                    educatorApproved: user.educatorApproved || false,
                    imageUrl: user.imageUrl,
                    token: generateToken(user._id, user.role, user.email)
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Unified Login (role-validated) ───────────────────────
// POST /api/auth/login
// Body: { email, password, role? }
//   role = 'user' (student, default) | 'educator'
//
// RBAC rules:
//   • role='user'     → any authenticated user is allowed (students, educators, admins)
//   • role='educator' → must have DB role='educator' AND educatorApproved=true
//   • Invalid / missing role defaults to 'user'
//
// On success the JWT is scoped to the selected role and activeRole is updated.
export const login = async (req, res) => {
    try {
        const { email, password, role: requestedRole } = req.body;
        const selectedRole = (requestedRole === 'educator') ? 'educator' : 'user';

        // ── Credentials check ──
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // ── Role validation ──
        if (selectedRole === 'educator') {
            if (user.role !== 'educator' || !user.educatorApproved) {
                return res.status(403).json({
                    success: false,
                    message: 'Educator access not approved. Please apply through the Educator Access page.'
                });
            }
        }

        // ── Update activeRole & issue session-scoped JWT ──
        user.activeRole = selectedRole;
        await user.save();

        const jwtRole = selectedRole;

        res.json({
            success: true,
            message: selectedRole === 'educator' ? 'Educator login successful' : 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                activeRole: selectedRole,
                educatorApproved: user.educatorApproved || false,
                imageUrl: user.imageUrl,
                token: generateToken(user._id, jwtRole, user.email)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Get Current User ─────────────────────────────────────
// GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Legacy educator-login (kept for backward compat) ─────
// POST /api/auth/educator-login  → delegates to unified login
export const educatorLogin = async (req, res) => {
    req.body.role = 'educator';
    return login(req, res);
};

// ─── Routes ───────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/educator-login', educatorLogin);
router.get('/me', protect, getMe);

export default router;

