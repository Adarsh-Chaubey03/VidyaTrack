// End-to-end check of the AI Study Assistant API.
// Boots nothing itself — expects the server on PORT (default 5000).
// Mints a JWT for an existing user so the real `protect` middleware is exercised.
//
// Run: node scripts/checkAiApi.js
import 'dotenv/config';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ChatSession from '../models/ChatSession.js';

const BASE = `http://localhost:${process.env.PORT || 5000}`;

const post = (path, body, token) =>
    fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

const get = (path, token) =>
    fetch(`${BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

const del = (path, token) =>
    fetch(`${BASE}${path}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

let pass = 0;
let fail = 0;
const check = (label, ok, detail = '') => {
    if (ok) { pass++; console.log(`PASS  ${label}`); }
    else { fail++; console.log(`FAIL  ${label}  ${detail}`); }
};

const preview = (s, n = 110) =>
    String(s || '').replace(/\s+/g, ' ').slice(0, n) + (String(s || '').length > n ? '…' : '');

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ role: 'user' }).select('_id name email');
    if (!user) throw new Error('No student user found in the database to test with.');
    console.log(`Testing as user: ${user.name} (${user._id})\n`);

    const token = jwt.sign(
        { id: String(user._id), role: 'user', email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Start from a clean slate so history assertions are deterministic.
    await ChatSession.deleteMany({ studentId: user._id });

    /* ── AUTH ─────────────────────────────────────────────── */
    const noAuth = await post('/api/ai/chat', { message: 'Explain binary search' }, null);
    check('rejects unauthenticated request (401)', noAuth.status === 401, JSON.stringify(noAuth));

    /* ── VALIDATION / EDGE CASES ──────────────────────────── */
    const empty = await post('/api/ai/chat', { message: '   ' }, token);
    check('rejects empty message (400)', empty.status === 400, JSON.stringify(empty));

    const missing = await post('/api/ai/chat', {}, token);
    check('rejects missing message (400)', missing.status === 400, JSON.stringify(missing));

    const tooLong = await post('/api/ai/chat', { message: 'a'.repeat(2500) }, token);
    check('rejects over-long message (400)', tooLong.status === 400, JSON.stringify(tooLong));

    const badId = await post('/api/ai/chat', { message: 'Explain recursion', conversationId: 'not-an-id' }, token);
    check('rejects malformed conversationId (400)', badId.status === 400, JSON.stringify(badId));

    /* ── OFF-TOPIC (must not call Gemini) ─────────────────── */
    for (const msg of ['Tell me a joke.', "What's the weather today?"]) {
        const t0 = Date.now();
        const r = await post('/api/ai/chat', { message: msg }, token);
        const ms = Date.now() - t0;
        const ok = r.status === 200 && r.body?.category === 'off_topic';
        check(`off-topic "${msg}" → category=off_topic (${ms}ms)`, ok, JSON.stringify(r.body));
        // A local refusal returns in single-digit ms; a model round trip cannot.
        check(`  ↳ answered locally, no provider call (${ms}ms < 250ms)`, ms < 250, `${ms}ms`);
    }

    const offTopicSessions = await ChatSession.countDocuments({ studentId: user._id });
    check('off-topic replies are not persisted', offTopicSessions === 0, `sessions=${offTopicSessions}`);

    /* ── STUDY QUESTIONS (real Gemini calls) ──────────────── */
    let conversationId = null;

    const studyCases = [
        ['STUDY', 'Explain binary search.'],
        ['DSA', 'Give me 5 medium-level array questions.'],
        ['PROGRAMMING', 'Why is this JavaScript code throwing undefined?\n```js\nconst u = {a:1};\nconsole.log(u.b.c);\n```'],
        ['CS', 'Explain normalization in DBMS.'],
        ['PLACEMENT', 'How should I prepare for a backend interview?'],
        ['PERSONALIZED', 'Suggest improvements in my skills.'],
        ['PERSONALIZED', 'What should I learn next?'],
    ];

    for (const [label, msg] of studyCases) {
        const t0 = Date.now();
        const r = await post('/api/ai/chat', { message: msg, conversationId }, token);
        const ms = Date.now() - t0;
        const b = r.body;
        const ok = r.status === 200 && b?.success === true && b?.category === 'study' &&
            typeof b?.message === 'string' && b.message.length > 20;
        check(`${label}: "${preview(msg, 45)}" (${ms}ms)`, ok, JSON.stringify(b)?.slice(0, 300));
        if (ok) {
            conversationId = b.conversationId || conversationId;
            console.log(`      intent=${b.intent} len=${b.message.length} suggestions=${b.suggestions?.length ?? 0}`);
            console.log(`      ${preview(b.message, 150)}`);
        }
    }

    check('conversation id was issued', Boolean(conversationId), String(conversationId));

    /* ── CONVERSATION CONTEXT ─────────────────────────────── */
    const followUp = await post('/api/ai/chat', { message: 'Give me one practice problem for that.', conversationId }, token);
    check('follow-up in an existing conversation is answered',
        followUp.status === 200 && followUp.body?.category === 'study',
        JSON.stringify(followUp.body)?.slice(0, 200));
    check('follow-up stays on the same conversation',
        followUp.body?.conversationId === conversationId,
        `${followUp.body?.conversationId} vs ${conversationId}`);

    /* ── PERSISTENCE ──────────────────────────────────────── */
    const stored = await ChatSession.findById(conversationId).lean();
    check('conversation persisted', Boolean(stored), 'not found');
    check('conversation belongs to the caller', String(stored?.studentId) === String(user._id));
    check('stored message count is capped at 40', (stored?.messages?.length ?? 0) <= 40,
        `messages=${stored?.messages?.length}`);

    /* ── OWNERSHIP: another student's conversation id ─────── */
    const other = await ChatSession.create({
        studentId: new mongoose.Types.ObjectId(),
        title: 'someone else',
        messages: [{ role: 'user', content: 'private' }, { role: 'assistant', content: 'secret' }],
    });
    const hijack = await post('/api/ai/chat', { message: 'What did I just say?', conversationId: String(other._id) }, token);
    const hijacked = await ChatSession.findById(other._id).lean();
    check("cannot write into another student's conversation",
        hijacked.messages.length === 2 && hijack.body?.conversationId !== String(other._id),
        `messages=${hijacked.messages.length} returnedId=${hijack.body?.conversationId}`);
    await ChatSession.deleteOne({ _id: other._id });

    /* ── SESSION BOOTSTRAP ────────────────────────────────── */
    const session = await get('/api/ai/session', token);
    check('GET /api/ai/session returns history + suggestions',
        session.status === 200 && Array.isArray(session.body?.messages) &&
        session.body.messages.length > 0 && Array.isArray(session.body?.suggestions) &&
        session.body.suggestions.length > 0,
        JSON.stringify(session.body)?.slice(0, 200));
    check('session reports availability', session.body?.available === true);
    console.log(`      suggestions: ${JSON.stringify(session.body?.suggestions)}`);

    /* ── CLEAR HISTORY ────────────────────────────────────── */
    const cleared = await del('/api/ai/session', token);
    const left = await ChatSession.countDocuments({ studentId: user._id });
    check('DELETE /api/ai/session clears history', cleared.status === 200 && left === 0, `left=${left}`);

    /* ── RATE LIMIT (rapid repeated requests) ─────────────── */
    if (process.env.RATE_LIMIT_SKIP === 'true') {
        console.log('SKIP  rate limit check (RATE_LIMIT_SKIP=true)');
    } else {
        // Off-topic messages are cheap and still pass through the limiter.
        const burst = await Promise.all(
            Array.from({ length: 25 }, () => post('/api/ai/chat', { message: 'Tell me a joke.' }, token))
        );
        const limited = burst.filter((r) => r.status === 429).length;
        check('rapid repeated requests get rate limited', limited > 0, `429s=${limited}/25`);
    }

    await ChatSession.deleteMany({ studentId: user._id });
    await mongoose.disconnect();

    console.log(`\n${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
};

run().catch(async (e) => {
    console.error('Test run failed:', e.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
