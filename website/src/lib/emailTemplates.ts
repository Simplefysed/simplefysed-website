import { siteConfig } from './siteConfig'

// Transactional email templates in the site's Paper & Ink brand. Email-safe:
// table layout, inline styles, solid hex (no alpha), web fonts loaded via a
// <link> for clients that honor it (Apple/iOS Mail) with graceful fallbacks.

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

// Paper & Ink palette (solid hex for email)
const INK = '#1B1A17'
const INK_MUTED = '#6B6760'
const RUST = '#D6442F'
const PAPER = '#F3F0E9'
const PAPER_CARD = '#FBF9F4'
const PAPER_OUTER = '#EDEAE1'
const HAIRLINE = '#E3DED3'

const FONTS_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />'

function emailWrapper(content: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="color-scheme" content="light" /><meta name="supported-color-schemes" content="light" />${FONTS_LINK}<!--[if mso]><style type="text/css">body,table,td{background-color:${PAPER_OUTER} !important;}</style><![endif]--></head>
<body style="margin:0;padding:0;background-color:${PAPER_OUTER};" bgcolor="${PAPER_OUTER}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER_OUTER};" bgcolor="${PAPER_OUTER}">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${PAPER_CARD};border:1px solid ${HAIRLINE};border-top:3px solid ${RUST};overflow:hidden;" bgcolor="${PAPER_CARD}">
      <!-- Header -->
      <tr><td style="padding:26px 32px 22px;text-align:center;border-bottom:1px solid ${HAIRLINE};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
          <td style="vertical-align:middle;padding-right:11px;"><img src="${siteConfig.url}/logo-mark.png" width="28" height="34" alt="Simplefysed" style="display:block;border:0;outline:none;" /></td>
          <td style="vertical-align:middle;font-family:${SANS};font-size:20px;font-weight:600;color:${INK};letter-spacing:-0.01em;">Simplefysed <span style="color:${RUST};">Solutions</span></td>
        </tr></table>
      </td></tr>
      <!-- Content -->
      <tr><td style="padding:32px;">
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:22px 32px;border-top:1px solid ${HAIRLINE};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${MONO};font-size:11px;color:${INK_MUTED};text-align:center;line-height:20px;letter-spacing:0.04em;">
          SIMPLEFYSED SOLUTIONS<br/>
          <a href="mailto:info@simplefysed.com" style="color:${INK_MUTED};text-decoration:none;">info@simplefysed.com</a><br/>
          &copy; ${new Date().getFullYear()} Simplefysed Solutions
        </td></tr></table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function kicker(text: string): string {
  return `<p style="margin:0 0 10px;font-family:${MONO};font-size:10px;font-weight:500;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.14em;">${text}</p>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 22px;font-family:${SERIF};font-size:26px;font-weight:600;color:${INK};line-height:1.15;letter-spacing:-0.01em;">${text}</h1>`
}

function dataRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${HAIRLINE};font-family:${MONO};font-size:10px;font-weight:500;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;width:118px;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${HAIRLINE};font-family:${SANS};font-size:15px;color:${INK};line-height:1.5;">${valueHtml}</td>
  </tr>`
}

export function inquiryEmail(
  name: string,
  email: string,
  country: string,
  company: string | undefined,
  service: string,
  description: string
): string {
  const companyValue = company && company.trim() ? company : 'Not provided'
  return emailWrapper(`
    ${kicker('New project inquiry')}
    ${heading(`New Project: '${name}'`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${HAIRLINE};">
      ${dataRow('Name', name)}
      ${dataRow('Email', `<a href="mailto:${email}" style="color:${RUST};text-decoration:none;">${email}</a>`)}
      ${dataRow('Country', country)}
      ${dataRow('Company', companyValue)}
      ${dataRow('Solution', service)}
    </table>
    <p style="margin:22px 0 8px;font-family:${MONO};font-size:10px;font-weight:500;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.1em;">Project description</p>
    <p style="margin:0 0 28px;font-family:${SANS};font-size:15px;color:${INK};line-height:1.65;">${description.replace(/\n/g, '<br />')}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background-color:${RUST};">
        <a href="mailto:${email}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:600;color:${PAPER};text-decoration:none;">Reply to ${name}</a>
      </td></tr>
    </table>
  `)
}

export function confirmationEmail(name: string, service: string, description: string): string {
  return emailWrapper(`
    ${kicker('Message received')}
    ${heading(`Thanks, ${name}.`)}
    <p style="margin:0 0 24px;font-family:${SANS};font-size:15px;color:${INK_MUTED};line-height:1.65;">We&rsquo;ve received your inquiry about <strong style="color:${INK};font-weight:600;">${service}</strong> and will reply within three business days.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background-color:${PAPER};border:1px solid ${HAIRLINE};padding:20px;">
        <p style="margin:0 0 8px;font-family:${MONO};font-size:10px;font-weight:500;color:${INK_MUTED};text-transform:uppercase;letter-spacing:0.1em;">Your message</p>
        <p style="margin:0;font-family:${SANS};font-size:14px;color:${INK};line-height:1.65;">${description.replace(/\n/g, '<br />')}</p>
      </td></tr>
    </table>
    <p style="margin:26px 0 0;font-family:${SANS};font-size:14px;color:${INK_MUTED};">The Simplefysed Team</p>
  `)
}
