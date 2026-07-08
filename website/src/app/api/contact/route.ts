import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rateLimit'
import { inquiryEmail, confirmationEmail } from '@/lib/emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Rate limit per client IP (5 submissions / 10 minutes) before any work.
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
      )
    }

    const body = await request.json()
    const { name, email, country, company, service, description, recaptchaToken } = body

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    if (!country || !country.trim()) {
      return NextResponse.json({ error: 'Please provide your country.' }, { status: 400 })
    }

    if (!service) {
      return NextResponse.json({ error: 'Please select a service.' }, { status: 400 })
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters.' }, { status: 400 })
    }

    // Verify the reCAPTCHA token with Google when a secret key is configured.
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'Please complete the reCAPTCHA.' }, { status: 400 })
      }
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }),
      })
      const verifyData = (await verifyRes.json()) as {
        success?: boolean
        score?: number
        action?: string
        hostname?: string
        'error-codes'?: string[]
      }
      // reCAPTCHA v3 returns a 0.0-1.0 score; 0.5 is Google's suggested threshold.
      if (!verifyData.success || (verifyData.score ?? 0) < 0.5) {
        // Logged server-side (e.g. Vercel logs) to aid debugging. A common cause
        // is "error-codes":["browser-error"], which means the request origin is
        // not in the key's allowed domains in the reCAPTCHA admin console.
        console.error('reCAPTCHA verification failed:', JSON.stringify(verifyData))
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Send inquiry to the team
    const { error } = await resend.emails.send({
      from: 'Simplefysed <noreply@simplefysed.com>',
      to: 'info@simplefysed.com',
      replyTo: email,
      subject: `New Project: ${name}`,
      html: inquiryEmail(name, email, country, company, service, description),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
    }

    // Send confirmation email to the submitter
    await resend.emails.send({
      from: 'Simplefysed <noreply@simplefysed.com>',
      to: email,
      subject: 'We received your message - Simplefysed',
      html: confirmationEmail(name, service, description),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
