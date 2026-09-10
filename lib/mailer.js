const nodemailer = require('nodemailer');
const site = require('../config/site');

let transporter = null;

function getTransporter() {
    if (!process.env.SMTP_HOST) return null;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : undefined
        });
    }
    return transporter;
}

const from = () => process.env.SMTP_FROM || `Contech Concrete <${site.email}>`;

/**
 * Send an email. Without SMTP_HOST configured, logs the email to console
 * only (mirrors the committed CMS project's behaviour) and never throws.
 */
async function sendMail({ to, subject, text, html }) {
    const t = getTransporter();
    if (!t) {
        console.log(`[mail:console-fallback] To: ${to} | Subject: ${subject}`);
        console.log(`[mail:console-fallback] Body:\n${text || html || ''}`);
        return { consoleOnly: true };
    }
    try {
        const info = await t.sendMail({ from: from(), to, subject, text, html });
        return info;
    } catch (err) {
        console.error('[mail] send failed:', err.message);
        return { failed: true, message: err.message };
    }
}

module.exports = { sendMail };