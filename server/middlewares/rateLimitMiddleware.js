import rateLimit from 'express-rate-limit';

// ── Auth rate limiter ──────────────────────────────────────────────────────
//
// Applied to: POST /api/auth/login, /register, /educator-login
//             POST /api/educator-access/login
//
// Window: 15 minutes, max 20 attempts per IP.
// This allows a legitimate user to make ~20 login attempts in a 15-minute
// window — enough for any reasonable usage — while making brute-force
// credential stuffing attacks impractical (20 attempts/15 min per IP).
//
// Separate from the general API limit so we don't accidentally throttle
// normal course browsing.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 20,
    standardHeaders: true,       // Return rate-limit info in RateLimit-* headers
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
    },
    // Skip rate limiting when running tests (RATE_LIMIT_SKIP=true in env)
    skip: () => process.env.RATE_LIMIT_SKIP === 'true',
});

// ── Registration rate limiter ──────────────────────────────────────────────
//
// Stricter than login: 10 registrations per IP per hour.
// Prevents automated account creation / spam account flooding.
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many accounts created from this IP. Please try again after an hour.',
    },
    skip: () => process.env.RATE_LIMIT_SKIP === 'true',
});

// ── General API limiter ────────────────────────────────────────────────────
//
// Applied at the app level as a safety net for unprotected public endpoints.
// 300 requests per minute per IP — generous enough for normal browsing
// but catches runaway scrapers or misconfigured clients.
//
// NOT applied to educator/payment/admin routes which have auth middleware
// protecting them already.
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,         // 1 minute
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
    skip: () => process.env.RATE_LIMIT_SKIP === 'true',
});

// ── AI chat limiter ────────────────────────────────────────────────────────
//
// Applied to: POST /api/ai/chat  (after `protect`, so req.user is available)
//
// Every request here costs a paid Gemini call, so this limit protects spend as
// much as it protects the server. 20 messages per 5 minutes is far more than a
// student reading answers can consume, but it stops a stuck retry loop or a
// scripted client from draining the API quota.
//
// Keyed by user id, not IP: a college lab or campus NAT puts many legitimate
// students behind one address, and IP-keying would throttle them collectively.
// Falls back to IP only if somehow reached unauthenticated.
export const aiChatLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,     // 5 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req.user?._id ? `u:${req.user._id}` : `ip:${req.ip}`),
    message: {
        success: false,
        message: 'You are sending messages too quickly. Please wait a minute and try again.',
    },
    skip: () => process.env.RATE_LIMIT_SKIP === 'true',
});
