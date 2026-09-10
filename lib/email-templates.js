const site = require('../config/site');

function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function fmtEnquiry(e) {
    return {
        'Client': e.client_name,
        'Company': e.company_name || '—',
        'Email': e.email,
        'Phone': e.phone,
        'Pipe type': e.pipe_type || 'Not specified',
        'Pipe diameter': e.pipe_diameter || 'Not specified',
        'Quantity': e.quantity || 'Not specified',
        'Delivery site': e.delivery_site || '—',
        'Message': e.message || '—'
    };
}

function textTable(rows) {
    const lines = [];
    for (const [k, v] of Object.entries(rows)) lines.push(`${k}: ${v}`);
    return lines.join('\n');
}

function htmlTable(rows) {
    const cells = Object.entries(rows)
        .filter(([k]) => k !== 'Message')
        .map(([k, v]) => `
            <tr>
                <td style="padding:8px 14px;color:#1e293b;font-weight:700;font-size:13px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${escapeHtml(k)}</td>
                <td style="padding:8px 14px;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;">${escapeHtml(v)}</td>
            </tr>`).join('');
    const message = rows['Message'] ? `
            <tr>
                <td style="padding:8px 14px;color:#1e293b;font-weight:700;font-size:13px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">Message</td>
                <td style="padding:8px 14px;color:#334155;font-size:13px;border-bottom:1px solid #e2e8f0;white-space:pre-line;">${escapeHtml(rows['Message'])}</td>
            </tr>` : '';
    return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;">${cells}${message}</table>`;
}

function layout({ heading, intro, body, cta, ctaLabel, footerNote }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(site.companyName)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table cellpadding="0" cellspacing="0" style="width:100%;background:#f1f5f9;padding:32px 16px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                    <tr>
                        <td style="background:#4169E1;padding:24px 28px;">
                            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">${escapeHtml(site.companyName)}</p>
                            <p style="margin:4px 0 0;color:#c7d5f7;font-size:12px;">RCC Concrete Pipe Manufacturer, Kathmandu</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <h1 style="margin:0 0 12px;color:#1e293b;font-size:22px;font-weight:700;">${escapeHtml(heading)}</h1>
                            ${intro ? `<p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">${intro}</p>` : ''}
                            ${body}
                            ${cta && ctaLabel ? `
                            <p style="margin:24px 0 0;text-align:center;">
                                <a href="${cta}" style="display:inline-block;background:#F59E0B;color:#1e293b;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:6px;">${escapeHtml(ctaLabel)}</a>
                            </p>` : ''}
                            ${footerNote ? `<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;line-height:1.6;">${footerNote}</p>` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc;padding:18px 28px;color:#94a3b8;font-size:12px;line-height:1.7;">
                            ${escapeHtml(site.companyName)} &middot; ${escapeHtml(site.address)}<br>
                            ${escapeHtml(site.email)} &middot; ${escapeHtml(site.phone)}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function clientConfirmation(e) {
    const rows = fmtEnquiry(e);
    return {
        subject: 'We received your quotation request - Contech Concrete',
        text: [
            `Dear ${e.client_name},`,
            '',
            'Thank you for your enquiry. We have received your quotation request and our team will respond within one business day.',
            '',
            'Your enquiry summary:',
            textTable(rows),
            '',
            `Questions? Contact us at ${site.email} or ${site.phone}.`,
            '',
            site.companyName
        ].join('\n'),
        html: layout({
            heading: 'Thank you, ' + e.client_name,
            intro: 'We have received your quotation request. Our team will respond within one business day. Here is the summary of your enquiry:',
            body: htmlTable(rows),
            footerNote: `Questions? Reply to this email or contact us at ${escapeHtml(site.email)} or ${escapeHtml(site.phone)}.`
        })
    };
}

function adminAlert(e) {
    const rows = fmtEnquiry(e);
    const adminUrl = (process.env.SITE_URL || 'http://localhost:3000') + `/admin/enquiries/${e.id}`;
    return {
        subject: `New enquiry: ${e.client_name}`,
        text: `A new enquiry was submitted:\n\n${textTable(rows)}\n\nManage it at: ${adminUrl}`,
        html: layout({
            heading: 'New enquiry submitted',
            intro: `<strong>${escapeHtml(e.client_name)}</strong> submitted a quotation request on the website.`,
            body: htmlTable(rows),
            cta: adminUrl,
            ctaLabel: 'Open in admin panel',
            footerNote: 'Respond promptly — enquiries are the core conversion path of the site.'
        })
    };
}

function contactedFollowUp(e) {
    return {
        subject: 'Your enquiry with Contech Concrete',
        text: [
            `Dear ${e.client_name},`,
            '',
            'Good news - our team has now contacted you regarding your quotation request.',
            '',
            `If you have any further questions, reach us at ${site.email} or ${site.phone}.`,
            '',
            site.companyName
        ].join('\n'),
        html: layout({
            heading: 'We have been in touch',
            intro: `Dear ${escapeHtml(e.client_name)},`,
            body: '<p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Good news &mdash; our team has now contacted you regarding your quotation request. If you have any further questions, reply to this email and we will be happy to help.</p>',
            footerNote: `Reach us directly at ${escapeHtml(site.email)} or ${escapeHtml(site.phone)}.`
        })
    };
}

module.exports = { clientConfirmation, adminAlert, contactedFollowUp };
