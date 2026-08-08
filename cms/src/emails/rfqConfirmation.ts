import type { Rfq } from '../payload-types'

function lineItemRows(doc: Rfq): string {
  return (doc.lineItems ?? [])
    .map(
      (item) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${item.productClass}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${item.diameter} mm</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${item.quantity}</td></tr>`,
    )
    .join('')
}

export function rfqConfirmationHtml(doc: Rfq, reference: string): string {
  return (
    `<div style="font-family:Inter,Arial,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;">` +
    `<h1 style="font-size:24px;margin:0 0 16px;">RFQ ${reference} received</h1>` +
    `<p>Dear ${doc.contactPerson},</p>` +
    `<p>Thank you for your bulk quote request from <strong>${doc.companyName}</strong>. Our engineering team is reviewing your requirements and will respond within 24 hours.</p>` +
    `<table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;margin:16px 0;">` +
    `<thead><tr style="background:#1e293b;color:#fff;text-align:left;">` +
    `<th style="padding:8px 12px;">Class</th><th style="padding:8px 12px;">Diameter</th><th style="padding:8px 12px;">Quantity</th>` +
    `</tr></thead><tbody>${lineItemRows(doc)}</tbody></table>` +
    `<p><strong>Delivery site:</strong> ${doc.deliverySite}</p>` +
    `<p><strong>Project type:</strong> ${doc.projectType}</p>` +
    `<p style="margin-top:24px;font-size:12px;color:#747685;">Contech Concrete and Allied Industries · quotes@contech-industries.com · ISO 9001:2015 Certified</p>` +
    `</div>`
  )
}

export function rfqConfirmationText(doc: Rfq, reference: string): string {
  const lines = (doc.lineItems ?? [])
    .map((item) => `- ${item.productClass} ${item.diameter}mm x ${item.quantity}`)
    .join('\n')
  return [
    `RFQ ${reference} received`,
    `Dear ${doc.contactPerson},`,
    `Thank you for your bulk quote request from ${doc.companyName}. Our engineering team will respond within 24 hours.`,
    '',
    lines,
    '',
    `Delivery site: ${doc.deliverySite}`,
    `Project type: ${doc.projectType}`,
    'Contech Concrete and Allied Industries · ISO 9001:2015 Certified',
  ].join('\n')
}
