'use client'

// reCAPTCHA v3 is invisible and score-based: there is no widget. We load the API
// keyed to the site key, then request a fresh token via grecaptcha.execute() at
// submit time. When the key is unset the helpers no-op, so the form still works.
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
export const RECAPTCHA_ENABLED = Boolean(SITE_KEY)

interface GrecaptchaV3 {
  ready: (cb: () => void) => void
  execute: (siteKey: string, opts: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaV3
  }
}

let scriptPromise: Promise<void> | null = null

// Loads the reCAPTCHA v3 script once and resolves when grecaptcha is ready.
export function loadRecaptcha(): Promise<void> {
  if (typeof window === 'undefined' || !SITE_KEY) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve) => {
    if (!document.querySelector('script[data-recaptcha]')) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
      script.async = true
      script.defer = true
      script.dataset.recaptcha = 'true'
      document.head.appendChild(script)
    }
    const waitReady = () => {
      if (window.grecaptcha?.execute && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => resolve())
      } else {
        setTimeout(waitReady, 50)
      }
    }
    waitReady()
  })
  return scriptPromise
}

// Runs an invisible v3 assessment and returns a single-use token, or null when
// reCAPTCHA is not configured. Call this right before submitting (tokens expire
// after ~2 minutes).
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!SITE_KEY) return null
  await loadRecaptcha()
  if (!window.grecaptcha?.execute) return null
  return window.grecaptcha.execute(SITE_KEY, { action })
}
