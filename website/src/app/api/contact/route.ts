import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const logoSvg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="4" height="20" rx="2" fill="#00fff2"/><rect x="9" y="8" width="4" height="12" rx="2" fill="#00fff2" opacity="0.7"/><rect x="16" y="6" width="4" height="16" rx="2" fill="#00fff2" opacity="0.85"/><rect x="23" y="2" width="4" height="24" rx="2" fill="#00fff2" opacity="0.55"/></svg>`

function emailWrapper(content: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="color-scheme" content="light dark" /><meta name="supported-color-schemes" content="light dark" /><!--[if mso]><style type="text/css">body,table,td{background-color:#0a0a0f !important;}</style><![endif]--></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;" bgcolor="#0a0a0f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0f;" bgcolor="#0a0a0f">
  <tr><td align="center" style="padding:32px 16px;" bgcolor="#0a0a0f">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#12121a;border:1px solid #1a1a24;border-radius:8px;border-top:3px solid #00fff2;overflow:hidden;" bgcolor="#12121a">
      <!-- Header -->
      <tr><td style="padding:28px 32px 20px;text-align:center;" bgcolor="#12121a">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
          <tr>
            <td style="vertical-align:middle;padding-right:10px;">${logoSvg}</td>
            <td style="vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#e0e0e8;letter-spacing:0.5px;">Simplefysed</td>
          </tr>
        </table>
      </td></tr>
      <!-- Content -->
      <tr><td style="padding:0 32px 32px;" bgcolor="#12121a">
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:20px 32px;border-top:1px solid #1a1a24;" bgcolor="#12121a">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#606070;text-align:center;line-height:20px;">
            Simplefysed Solutions<br/>
            <a href="mailto:info@simplefysed.com" style="color:#606070;text-decoration:none;">info@simplefysed.com</a><br/>
            &copy; ${new Date().getFullYear()} Simplefysed. All rights reserved.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function inquiryEmail(name: string, email: string, company: string | undefined, service: string, description: string): string {
  const companyRow = company
    ? `<tr>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9090a0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:120px;">Company</td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#e0e0e8;">${company}</td>
       </tr>`
    : ''

  return emailWrapper(`
    <h1 style="margin:0 0 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:600;color:#e0e0e8;">New Contact Form Submission</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9090a0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:120px;">Name</td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#e0e0e8;">${name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9090a0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:120px;">Email</td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#e0e0e8;"><a href="mailto:${email}" style="color:#00fff2;text-decoration:none;">${email}</a></td>
      </tr>
      ${companyRow}
      <tr>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9090a0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:120px;">Service</td>
        <td style="padding:8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#e0e0e8;">${service}</td>
      </tr>
    </table>
    <!-- Divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
      <tr><td style="border-top:1px solid #1a1a24;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    </table>
    <!-- Project Description -->
    <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9090a0;text-transform:uppercase;letter-spacing:1px;">Project Description</p>
    <p style="margin:0 0 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#e0e0e8;line-height:1.6;">${description.replace(/\n/g, '<br />')}</p>
    <!-- CTA Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border-radius:6px;background-color:#00fff2;">
        <a href="mailto:${email}" style="display:inline-block;padding:12px 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#0a0a0f;text-decoration:none;">Reply to ${name}</a>
      </td></tr>
    </table>
  `)
}

function confirmationEmail(name: string, service: string, description: string): string {
  return emailWrapper(`
    <h1 style="margin:0 0 16px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:600;color:#e0e0e8;">Thanks for reaching out, ${name}!</h1>
    <p style="margin:0 0 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#9090a0;line-height:1.6;">We've received your inquiry about <strong style="color:#e0e0e8;">${service}</strong> and our team will get back to you within 1-2 business days.</p>
    <!-- Divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr><td style="border-top:1px solid #1a1a24;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    </table>
    <!-- Summary Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background-color:#0a0a0f;border-radius:6px;padding:20px;" bgcolor="#0a0a0f">
        <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#606070;text-transform:uppercase;letter-spacing:1px;">Your message</p>
        <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#9090a0;line-height:1.6;">${description.replace(/\n/g, '<br />')}</p>
      </td></tr>
    </table>
    <!-- Sign-off -->
    <p style="margin:24px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#606070;">&mdash; The Simplefysed Team</p>
  `)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, service, description } = body

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    if (!service) {
      return NextResponse.json({ error: 'Please select a service.' }, { status: 400 })
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters.' }, { status: 400 })
    }

    // Send inquiry to the team
    const { error } = await resend.emails.send({
      from: 'Simplefysed <info@simplefysed.com>',
      to: 'vin@simplefysed.com',
      replyTo: email,
      subject: `New Inquiry: ${service} - ${name}`,
      html: inquiryEmail(name, email, company, service, description),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
    }

    // Send confirmation email to the submitter
    await resend.emails.send({
      from: 'Simplefysed <info@simplefysed.com>',
      to: email,
      subject: 'We received your message - Simplefysed',
      html: confirmationEmail(name, service, description),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
