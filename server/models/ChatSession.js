import mongoose from 'mongoose';

/* ─────────────────────────────────────────────────────────────────────────────
   ChatSession — persistence for the AI Study Assistant.

   Deliberately minimal: one document per conversation, messages inlined.
   No separate Message collection, no embeddings, no summaries — a study chat
   is short-lived and read whole or not at all.

   Two hard limits keep documents small and predictable:
     • MAX_STORED_MESSAGES — oldest turns are dropped, not archived.
     • a 30-day TTL on updatedAt — abandoned conversations clean themselves up.
   ──────────────────────────────────────────────────────────────────────────── */

export const MAX_STORED_MESSAGES = 40;

// How many past messages are ever sent to the model. Kept well below the
// storage cap so cost stays flat no matter how long a conversation runs.
export const MAX_CONTEXT_MESSAGES = 8;

const messageSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true, maxlength: 8000 },
        at: { type: Date, default: Date.now },
    },
    { _id: false }
);

const chatSessionSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // First user message, truncated — used to label the conversation in the UI.
        title: { type: String, default: 'New chat', trim: true, maxlength: 80 },

        messages: [messageSchema],
    },
    { timestamps: true }
);

// Resume-the-latest-conversation query: findOne({ studentId }).sort({ updatedAt: -1 })
chatSessionSchema.index({ studentId: 1, updatedAt: -1 });

// TTL: MongoDB removes conversations untouched for 30 days. This bounds growth
// without any cron job. Drop this index if long-term chat history is ever a
// product requirement.
chatSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Enforce the message cap in the model rather than at every call site.
chatSessionSchema.pre('save', function (next) {
    if (this.messages.length > MAX_STORED_MESSAGES) {
        this.messages = this.messages.slice(-MAX_STORED_MESSAGES);
    }
    next();
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
