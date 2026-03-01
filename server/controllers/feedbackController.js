import nodemailer from 'nodemailer';

// POST /api/feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;

    // ---- Validation ----
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Full Name is required (min 2 characters).');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('A valid email address is required.');
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.push('Subject is required (min 3 characters).');
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message is required (min 10 characters).');
    }
    if (rating !== undefined && rating !== null && rating !== '') {
      const r = Number(rating);
      if (!Number.isInteger(r) || r < 1 || r > 5) {
        errors.push('Rating must be an integer between 1 and 5.');
      }
    }

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    // ---- Sanitize ----
    const clean = (str) => String(str).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeName    = clean(name);
    const safeEmail   = clean(email);
    const safeSubject = clean(subject);
    const safeMessage = clean(message);
    const safeRating  = rating ? Number(rating) : null;

    // ---- Build email ----
    const ratingStars = safeRating
      ? '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating) + ` (${safeRating}/5)`
      : 'Not provided';

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
        <div style="background:linear-gradient(135deg,#022c22,#0d9488);padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="margin:0;color:#fff;font-size:20px">New Feedback Submitted</h2>
          <p style="margin:4px 0 0;color:#a7f3d0;font-size:13px">VidyaTrack Feedback System</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:28px 32px;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:110px;vertical-align:top">Name</td><td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#059669;text-decoration:none">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Subject</td><td style="padding:8px 0;font-weight:600">${safeSubject}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Rating</td><td style="padding:8px 0;color:#f59e0b">${ratingStars}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${safeMessage}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0 12px" />
          <p style="font-size:11px;color:#9ca3af;margin:0">This email was sent from the VidyaTrack feedback form.</p>
        </div>
      </div>`;

    // ---- Send email via Nodemailer (best-effort, don't block response) ----
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"VidyaTrack Feedback" <${process.env.SMTP_USER}>`,
        to: process.env.FEEDBACK_RECEIVER_EMAIL || process.env.SMTP_USER,
        replyTo: safeEmail,
        subject: 'New Feedback Submitted - VidyaTrack',
        html: htmlBody,
      });
    } catch (emailErr) {
      console.error('Feedback email failed (non-blocking):', emailErr.message);
    }

    return res.json({ success: true, message: 'Your feedback has been submitted successfully.' });
  } catch (error) {
    console.error('Feedback error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};
