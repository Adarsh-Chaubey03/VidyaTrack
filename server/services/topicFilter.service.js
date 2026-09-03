/* ─────────────────────────────────────────────────────────────────────────────
   Pre-flight topic filter.

   Purpose: answer obvious off-topic messages ("tell me a joke") without paying
   for a Gemini call, WITHOUT over-blocking legitimate study questions.

   The filter deliberately returns three outcomes, not two:

     'study'      → definitely on-topic, skip straight to the model
     'off_topic'  → confidently off-topic, answer locally, no model call
     'unknown'    → can't tell from keywords alone (e.g. "suggest me improvement",
                    "yes", "why?") → hand it to the model, whose system
                    instruction does the real judging

   'unknown' is the important one. A keyword list can never understand intent,
   so anything ambiguous is escalated rather than refused. Only the clear-cut
   cases are short-circuited here.
   ──────────────────────────────────────────────────────────────────────────── */

// ── Strong on-topic signals ────────────────────────────────────────────────
// Specific enough that their presence alone settles the question. If any of
// these appear, the message is treated as study-related even when it also
// contains a blocked word — "what's a good weather API in Node?" is a real
// question, not a forecast request.
const STRONG_STUDY_PATTERNS = [
    // Languages, runtimes, frameworks
    /\b(javascript|typescript|js|jsx|tsx|node\.?js|express\.?js|react|redux|next\.?js|angular|vue|mern|mean)\b/,
    /\b(java|python|c\+\+|cpp|c#|golang|rust|kotlin|swift|php|ruby|scala|matlab|r programming)\b/,
    /\b(html|css|tailwind|bootstrap|sass|scss)\b/,
    /\b(mongodb|mongoose|mysql|postgres(ql)?|sqlite|redis|firebase|supabase|prisma)\b/,
    /\b(docker|kubernetes|jenkins|git|github|gitlab|ci\/cd|devops|aws|azure|gcp|linux|bash|shell script)\b/,

    // Core CS subjects
    /\b(dsa|data structures?|algorithms?|dbms|rdbms|operating systems?|\bos\b|computer networks?|networking|compiler|automata|theory of computation|discrete math)\b/,
    /\b(oop|oops|object[- ]oriented|encapsulation|polymorphism|inheritance|abstraction)\b/,
    /\b(normalization|denormalization|indexing|acid|transactions?|deadlock|sharding|replication)\b/,
    /\b(tcp|udp|http|https|dns|osi model|subnet|socket|rest api|graphql|websocket|api)\b/,
    /\b(thread|threads|concurrency|mutex|semaphore|scheduling|paging|segmentation|virtual memory)\b/,

    // Data structures & algorithms
    /\b(array|arrays|string|strings|linked list|stack|queue|heap|hashmap|hash table|hashing|tree|binary tree|bst|graph|trie|matrix)\b/,
    /\b(recursion|backtracking|dynamic programming|\bdp\b|greedy|divide and conquer|two pointers?|sliding window|binary search|sorting|merge sort|quick sort|bfs|dfs|dijkstra|topological sort)\b/,
    /\b(time complexity|space complexity|big[- ]?o|o\(n\)|asymptotic|optimi[sz]e|optimi[sz]ation)\b/,

    // Programming activity
    /\b(code|coding|program|programming|function|variable|loop|compile|compiler|syntax|debug|debugging|refactor|unit test|test case|stack trace|exception|segmentation fault|null pointer|undefined|runtime error)\b/,
    /\b(leetcode|codeforces|hackerrank|codechef|gfg|geeksforgeeks|neetcode|striver)\b/,

    // Placement / career prep
    /\b(interview|interviews|placement|placements|internship|aptitude|hr round|technical round|mock interview|coding round|system design|resume|cv|portfolio|cover letter)\b/,
    /\b(backend|frontend|full[- ]?stack|software engineer|sde|developer role|target role|job role|career path|skill|skills|skill gap|tech stack)\b/,

    // "my project" / "my skills" style questions are core to this product
    /\b(project|projects|side project|capstone|major project|minor project)\b/,

    // Academic framing
    /\b(semester|syllabus|curriculum|gate exam|university exam|viva|assignment|thesis|research paper|lab manual)\b/,

    // Learning-intent phrasing that is unambiguously technical/academic
    /\b(roadmap|learning path|study plan|revision plan|practice questions?|explain (me )?(the )?concept|technical skills?)\b/,
];

// ── Weak on-topic signals ──────────────────────────────────────────────────
// Academic-ish but too generic to override a blocked word. "Tell me a story
// unrelated to studies" contains "studies" and is still off-topic.
const WEAK_STUDY_PATTERNS = [
    /\b(study|studies|studying|learn|learning|revise|revision|prepare|preparation|exam|exams|test|quiz|practice|concept|topic|subject|course|tutorial|notes|doubt|explain|understand|improve|improvement|progress|weakness|strength)\b/,
];

// ── Off-topic signals ──────────────────────────────────────────────────────
// Kept narrow and phrase-based rather than single common words, so they only
// fire on requests that really are outside the product's purpose.
const OFF_TOPIC_PATTERNS = [
    // Entertainment
    /\b(joke|jokes|pun|puns|riddle|meme|memes|funny thing)\b/,
    /\b(tell|write|give|share) (me )?(a |an |some )?(story|stories|poem|poems|shayari|song|lyrics|rap)\b/,
    /\b(play|let's play|lets play) (a )?(game|games|chess|quiz with me|truth or dare)\b/,
    /\b(movie|movies|netflix|web series|anime recommendation|tv show)\b/,

    // Personal / relationship
    /\b(romantic|flirt|flirty|love letter|girlfriend|boyfriend|crush|dating|breakup|marriage proposal)\b/,

    // Everyday life
    /\b(weather|temperature outside|forecast|will it rain)\b/,
    /\b(recipe|recipes|cook|cooking|how to make (tea|coffee|biryani|pasta|maggi)|restaurant|food delivery)\b/,
    /\b(horoscope|zodiac|astrology|numerology|tarot|lucky number)\b/,
    /\b(cricket score|football score|match score|ipl|world cup|who won the match)\b/,

    // Public figures / news / politics
    /\b(richest|net worth|celebrity|gossip|bollywood|hollywood|actor|actress|singer)\b/,
    /\b(political|politics|election|prime minister|president of|vote for|government scheme)\b/,
    /\b(stock tip|which stock|crypto tip|should i buy bitcoin|lottery|betting|gambling)\b/,

    // Medical / legal advice
    /\b(medical advice|diagnose me|my symptoms|prescription|legal advice|sue someone)\b/,

    // Attempts to extract the configuration
    /\b(system prompt|system instruction|your prompt|your instructions|initial prompt)\b/,
    /\bignore (all )?(your )?(previous|prior|above|earlier) (instructions|rules|prompts?)\b/,
    /\b(reveal|show|print|repeat|leak) (me )?(your|the) (prompt|instructions|rules|configuration)\b/,
];

// Code fences, or syntax dense enough that it can only be source code.
const CODE_PATTERNS = [
    /```/,
    /\b(function|const|let|var|class|def|public static void|import |#include|SELECT .* FROM|console\.log|System\.out\.print|printf|cout\s*<<|print\()/,
    /[{};]\s*$/m,
    /=>\s*[{(]/,
];

const countMatches = (text, patterns) =>
    patterns.reduce((n, re) => (re.test(text) ? n + 1 : n), 0);

/**
 * Classify a student message before it reaches the model.
 *
 * @param {string} message           raw user message
 * @param {boolean} hasHistory       true when this is a follow-up in an ongoing
 *                                   conversation — short replies like "why?"
 *                                   must never be refused on their own.
 * @returns {'study'|'off_topic'|'unknown'}
 */
export const classifyTopic = (message, hasHistory = false) => {
    const text = String(message || '').toLowerCase().trim();
    if (!text) return 'unknown';

    // Anything containing code is a code question, full stop.
    if (countMatches(text, CODE_PATTERNS) > 0) return 'study';

    const strong = countMatches(text, STRONG_STUDY_PATTERNS);
    if (strong > 0) return 'study';

    const blocked = countMatches(text, OFF_TOPIC_PATTERNS);
    if (blocked > 0) return 'off_topic';

    // Follow-ups inherit the topic of the thread they belong to. Refusing
    // "can you expand on that?" because it has no keywords would be absurd.
    if (hasHistory) return 'unknown';

    const weak = countMatches(text, WEAK_STUDY_PATTERNS);
    if (weak > 0) return 'study';

    // Genuinely ambiguous ("suggest me improvement") — let the model decide.
    return 'unknown';
};

/** The single reply sent for locally-detected off-topic messages. */
export const OFF_TOPIC_REPLY =
    'I can help with study, technical learning, and placement preparation. Please ask a study-related question.';
