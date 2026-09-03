import { GoogleGenAI } from '@google/genai';

/* ─────────────────────────────────────────────────────────────────────────────
   Gemini provider — the ONLY file in the codebase that knows about Google's SDK.
   Everything above it talks in terms of { systemInstruction, contents, schema }
   so the provider can be swapped without touching the chatbot logic.

   Nothing here knows anything about VidyaTrack, students, or study topics —
   that lives in studyAssistant.service.js.
   ──────────────────────────────────────────────────────────────────────────── */

// Default model.
//
// The brief asked for gemini-2.5-flash, but the Gemini API now rejects it for
// keys created after its deprecation ("no longer available to new users"), so
// it is not a usable default. Measured against this project's key:
//   gemini-2.5-flash     404 — unavailable
//   gemini-flash-latest  works but returned 503 "high demand" on 3 of 5 calls
//   gemini-3.6-flash     works but ~29s per answer even at LOW thinking
//   gemini-3.5-flash     5/5 successful, ~2-3.5s per answer  ← chosen
//
// Override with GEMINI_MODEL if a different tier is preferred; no code change
// is needed.
const DEFAULT_MODEL = 'gemini-3.5-flash';
const DEFAULT_TIMEOUT_MS = 30000;

// Transient upstream failures (503 "high demand", 500) are common on the flash
// tier and usually clear immediately. One quick retry turns most of them into a
// normal answer instead of an error toast. Deliberately one — not a retry loop.
const RETRY_STATUSES = new Set([500, 502, 503]);
const RETRY_DELAY_MS = 700;

/**
 * Normalised error thrown by this module.
 * `code` is a stable string the HTTP layer can map to a user-facing message —
 * the raw provider error is never allowed to escape.
 */
export class AiServiceError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'AiServiceError';
        this.code = code; // not_configured | timeout | rate_limited | blocked | invalid_response | upstream
    }
}

// Lazily created so a missing key never crashes server boot — the rest of the
// app must keep working when the AI feature is unconfigured.
let _client = null;

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new AiServiceError('not_configured', 'AI provider is not configured');
    }
    if (!_client) {
        _client = new GoogleGenAI({ apiKey });
    }
    return _client;
};

/** True when the AI feature has the credentials it needs to run. */
export const isConfigured = () => Boolean(process.env.GEMINI_API_KEY);

/** The model in use. Overridable via env so upgrades need no code change. */
export const getModelName = () => process.env.GEMINI_MODEL || DEFAULT_MODEL;

// ── Error mapping ──────────────────────────────────────────────────────────
//
// Provider errors are noisy and can contain request echoes. We collapse them
// into a handful of codes and deliberately drop the original message.
const mapProviderError = (err) => {
    if (err instanceof AiServiceError) return err;

    const status = Number(err?.status) || 0;
    const name = String(err?.name || '');

    if (name === 'AbortError' || name === 'TimeoutError') {
        return new AiServiceError('timeout', 'AI request timed out');
    }
    if (status === 429) {
        return new AiServiceError('rate_limited', 'AI provider rate limit reached');
    }
    if (status === 401 || status === 403) {
        return new AiServiceError('not_configured', 'AI provider rejected the credentials');
    }
    if (status === 404) {
        // Almost always a GEMINI_MODEL that this key cannot use. A student
        // retrying will not fix it, so surface it as unavailable, not flaky.
        return new AiServiceError('not_configured', 'Configured AI model is unavailable');
    }
    return new AiServiceError('upstream', 'AI provider request failed');
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── JSON extraction ────────────────────────────────────────────────────────
//
// responseMimeType: 'application/json' makes the model return bare JSON, but a
// model can still wrap it in a ```json fence or emit a leading prose line when
// it is nudged off-schema. This recovers the object in those cases rather than
// failing the whole request.
const parseJsonLoosely = (raw) => {
    if (!raw || typeof raw !== 'string') return null;

    const text = raw.trim();

    try {
        return JSON.parse(text);
    } catch {
        // fall through to recovery
    }

    // Strip a markdown fence, if present.
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) {
        try {
            return JSON.parse(fenced[1]);
        } catch {
            // fall through
        }
    }

    // Last resort: the outermost {...} span.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
        try {
            return JSON.parse(text.slice(start, end + 1));
        } catch {
            // give up
        }
    }

    return null;
};

/**
 * Ask the provider for a single structured (JSON) completion.
 *
 * @param {object}   opts
 * @param {string}   opts.systemInstruction  Persona + rules for the model.
 * @param {Array}    opts.contents           Gemini `Content[]` — the conversation.
 * @param {object}   opts.responseSchema     Gemini `Schema` describing the JSON shape.
 * @param {number}  [opts.maxOutputTokens]
 * @param {number}  [opts.temperature]
 * @param {number}  [opts.timeoutMs]
 * @returns {Promise<object>} the parsed JSON object
 * @throws  {AiServiceError}
 */
export const generateStructured = async ({
    systemInstruction,
    contents,
    responseSchema,
    maxOutputTokens = 1400,
    temperature = 0.4,
    timeoutMs = DEFAULT_TIMEOUT_MS,
}) => {
    const ai = getClient();
    const model = getModelName();

    // Base config. The abort signal is added per attempt below, because a
    // timeout signal is single-use.
    const config = {
        systemInstruction,
        temperature,
        topP: 0.9,
        maxOutputTokens,
        responseMimeType: 'application/json',
        responseSchema,
        httpOptions: { timeout: timeoutMs },
    };

    let response;
    let lastError;

    // Attempt 0, then one retry for transient upstream failures only.
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            response = await ai.models.generateContent({
                model,
                contents,
                // A fresh abort signal per attempt — a consumed timeout signal
                // would abort the retry instantly.
                config: { ...config, abortSignal: AbortSignal.timeout(timeoutMs) },
            });
            lastError = null;
            break;
        } catch (err) {
            lastError = err;
            const retryable = RETRY_STATUSES.has(Number(err?.status));
            // Log the shape of the failure but never the key, the prompt, or
            // the student's message.
            console.error(
                `[ai] provider call failed (model=${model}, status=${err?.status || 'n/a'}, attempt=${attempt + 1}${retryable && attempt === 0 ? ', retrying' : ''})`
            );
            if (!retryable || attempt === 1) break;
            await sleep(RETRY_DELAY_MS);
        }
    }

    if (lastError) throw mapProviderError(lastError);

    // Safety filters and token exhaustion both surface as a usable response
    // object with no text — treat them distinctly from a network failure.
    const blockReason = response?.promptFeedback?.blockReason;
    if (blockReason) {
        throw new AiServiceError('blocked', 'Request was blocked by the AI provider');
    }

    const parsed = parseJsonLoosely(response?.text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        const finish = response?.candidates?.[0]?.finishReason;
        console.error(`[ai] unparseable provider response (finishReason=${finish || 'n/a'})`);
        throw new AiServiceError('invalid_response', 'AI returned an unreadable response');
    }

    return parsed;
};
