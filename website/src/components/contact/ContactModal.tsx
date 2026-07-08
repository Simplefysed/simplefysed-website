'use client'

import { useState, useEffect, useRef, FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle, Loader2, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react'
import { useContactStore } from '@/stores/contactStore'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { lockScroll, unlockScroll } from '@/lib/scrollLock'
import { solutions } from '@/data/solutions'
import { executeRecaptcha, loadRecaptcha, RECAPTCHA_ENABLED } from './Recaptcha'

interface FormData {
  firstName: string
  lastName: string
  email: string
  country: string
  company: string
  service: string
  description: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  country?: string
  service?: string
  description?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

// The three productized solutions, straight from the shared data, plus an
// escape hatch for people who don't know which one fits yet.
const SERVICE_OPTIONS = [...solutions.map((s) => s.title), 'Not sure yet']

export function ContactModal() {
  const { isOpen, closeModal } = useContactStore()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    company: '',
    service: '',
    description: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  // The inquiry is collected across two steps: 1) who you are, 2) your project.
  const [step, setStep] = useState<1 | 2>(1)

  const panelRef = useRef<HTMLDivElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const serviceRef = useRef<HTMLSelectElement>(null)

  // Shift-free scroll lock (see lib/scrollLock.ts)
  useEffect(() => {
    if (!isOpen) return
    lockScroll()
    return () => unlockScroll()
  }, [isOpen])

  // Preload reCAPTCHA v3 when the modal opens so the token is ready at submit.
  useEffect(() => {
    if (isOpen && RECAPTCHA_ENABLED) loadRecaptcha()
  }, [isOpen])

  // Escape key close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeModal])

  // Restore focus to the trigger when the modal closes.
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    return () => {
      previouslyFocused?.focus?.()
    }
  }, [isOpen])

  // Focus the first field of the current step (on open and on step change).
  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => {
      if (step === 1) firstNameRef.current?.focus()
      else serviceRef.current?.focus()
    }, 60)
    return () => clearTimeout(t)
  }, [isOpen, step])

  // Auto-close after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        handleClose()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [status])

  function handleClose() {
    closeModal()
    // Reset form after animation completes
    setTimeout(() => {
      setFormData({ firstName: '', lastName: '', email: '', country: '', company: '', service: '', description: '' })
      setErrors({})
      setStatus('idle')
      setServerError('')
      setStep(1)
    }, 300)
  }

  // Focus trap: keep Tab cycling within the panel while open
  function handleKeyDown(e: ReactKeyboardEvent) {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  function validateStep1(): FormErrors {
    const errs: FormErrors = {}
    if (!formData.firstName.trim()) {
      errs.firstName = 'Please enter your first name.'
    }
    if (!formData.lastName.trim()) {
      errs.lastName = 'Please enter your last name.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.country.trim()) {
      errs.country = 'Please enter your country.'
    }
    return errs
  }

  function validateStep2(): FormErrors {
    const errs: FormErrors = {}
    if (!formData.service) {
      errs.service = 'Please select a solution.'
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters.'
    }
    return errs
  }

  function handleNext() {
    const errs = validateStep1()
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(2)
  }

  function handleBack() {
    setStep(1)
    setStatus('idle')
    setServerError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const step1Errors = validateStep1()
    const step2Errors = validateStep2()
    setErrors({ ...step1Errors, ...step2Errors })
    // If an earlier step is somehow invalid, send the visitor back to fix it.
    if (Object.keys(step1Errors).length > 0) {
      setStep(1)
      return
    }
    if (Object.keys(step2Errors).length > 0) return

    setStatus('submitting')
    setServerError('')

    try {
      // Invisible reCAPTCHA v3: fetch a fresh score token right before submit.
      const recaptchaToken = RECAPTCHA_ENABLED ? await executeRecaptcha('contact_submit') : null
      if (RECAPTCHA_ENABLED && !recaptchaToken) {
        throw new Error('Could not verify you are human. Please try again.')
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email,
          country: formData.country,
          company: formData.company,
          service: formData.service,
          description: formData.description,
          recaptchaToken,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const inputStyles =
    'w-full bg-paper-card rounded-none border px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-rust focus:ring-2 focus:ring-rust/25 transition-colors'
  const labelStyles = 'block font-mono text-[10px] tracking-[0.12em] uppercase text-ink-muted mb-2'
  const req = <span aria-hidden="true" className="text-rust"> *</span>

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — warm ink dim so the paper panel reads forward */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pr-[calc(1rem+var(--removed-scrollbar,0px))]"
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="bg-paper w-full max-w-[39.6rem] max-h-[90vh] overflow-y-auto rounded-none border border-ink/10 border-t-2 border-t-rust shadow-[0_24px_60px_-15px_rgba(27,26,23,0.4)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-7 pb-0">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-2">
                    Let&apos;s build
                  </p>
                  <h2
                    id="contact-modal-title"
                    className="font-serif text-ink text-3xl leading-tight tracking-[-0.01em]"
                  >
                    Start your <span className="text-rust">project.</span>
                  </h2>
                  <p className="text-ink-muted text-sm mt-3 max-w-sm">
                    Tell us what you need. We&apos;ll take it from there.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="-mr-1 rounded-none p-1 text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rust/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-7 pt-6">
                {status === 'success' ? (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <CheckCircle className="w-14 h-14 text-rust mb-5" />
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-2">
                      Sent
                    </p>
                    <h3 className="font-serif text-ink text-2xl mb-2">Message sent.</h3>
                    <p className="text-ink-muted">We&apos;ll reply within three business days.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Step progress */}
                    <div className="mb-6 flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                        Step {step} of 2
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
                      <span aria-hidden="true" className="flex gap-1.5">
                        <span className={cn('h-1 w-6 transition-colors', step >= 1 ? 'bg-rust' : 'bg-ink/15')} />
                        <span className={cn('h-1 w-6 transition-colors', step >= 2 ? 'bg-rust' : 'bg-ink/15')} />
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      {step === 1 ? (
                        <>
                          {/* First + Last name side by side */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="contact-firstname" className={labelStyles}>
                                First name{req}
                              </label>
                              <input
                                ref={firstNameRef}
                                id="contact-firstname"
                                type="text"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                aria-invalid={!!errors.firstName}
                                aria-describedby={errors.firstName ? 'contact-firstname-error' : undefined}
                                className={cn(inputStyles, errors.firstName ? 'border-rust' : 'border-ink/15')}
                              />
                              {errors.firstName && (
                                <p id="contact-firstname-error" className="mt-1.5 text-[13px] text-rust">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="contact-lastname" className={labelStyles}>
                                Last name{req}
                              </label>
                              <input
                                id="contact-lastname"
                                type="text"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                aria-invalid={!!errors.lastName}
                                aria-describedby={errors.lastName ? 'contact-lastname-error' : undefined}
                                className={cn(inputStyles, errors.lastName ? 'border-rust' : 'border-ink/15')}
                              />
                              {errors.lastName && (
                                <p id="contact-lastname-error" className="mt-1.5 text-[13px] text-rust">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label htmlFor="contact-email" className={labelStyles}>
                              Email{req}
                            </label>
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="you@company.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              aria-invalid={!!errors.email}
                              aria-describedby={errors.email ? 'contact-email-error' : undefined}
                              className={cn(inputStyles, errors.email ? 'border-rust' : 'border-ink/15')}
                            />
                            {errors.email && (
                              <p id="contact-email-error" className="mt-1.5 text-[13px] text-rust">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          {/* Country */}
                          <div>
                            <label htmlFor="contact-country" className={labelStyles}>
                              Country{req}
                            </label>
                            <input
                              id="contact-country"
                              type="text"
                              placeholder="Your country"
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              aria-invalid={!!errors.country}
                              aria-describedby={errors.country ? 'contact-country-error' : undefined}
                              className={cn(inputStyles, errors.country ? 'border-rust' : 'border-ink/15')}
                            />
                            {errors.country && (
                              <p id="contact-country-error" className="mt-1.5 text-[13px] text-rust">
                                {errors.country}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Solution + Company side by side */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="contact-service" className={labelStyles}>
                                Solution{req}
                              </label>
                              <div className="relative">
                                <select
                                  ref={serviceRef}
                                  id="contact-service"
                                  value={formData.service}
                                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                  aria-invalid={!!errors.service}
                                  aria-describedby={errors.service ? 'contact-service-error' : undefined}
                                  className={cn(
                                    inputStyles,
                                    // color-scheme:light keeps the native option list on a
                                    // light popup even if the visitor's OS is in dark mode.
                                    'appearance-none cursor-pointer pr-10 [color-scheme:light]',
                                    errors.service ? 'border-rust' : 'border-ink/15',
                                    // Only the closed field shows the placeholder faintly;
                                    // the options themselves set their own readable color.
                                    !formData.service && 'text-ink-muted/60'
                                  )}
                                >
                                  <option value="" disabled className="bg-paper-card text-ink-muted">
                                    Select a solution
                                  </option>
                                  {SERVICE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt} className="bg-paper-card text-ink">
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                              </div>
                              {errors.service && (
                                <p id="contact-service-error" className="mt-1.5 text-[13px] text-rust">
                                  {errors.service}
                                </p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="contact-company" className={labelStyles}>
                                Company <span className="text-ink-muted/60">· optional</span>
                              </label>
                              <input
                                id="contact-company"
                                type="text"
                                placeholder="Your company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className={cn(inputStyles, 'border-ink/15')}
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label htmlFor="contact-description" className={labelStyles}>
                              Description{req}
                            </label>
                            <textarea
                              id="contact-description"
                              rows={4}
                              placeholder="Tell us about your project."
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              aria-invalid={!!errors.description}
                              aria-describedby={errors.description ? 'contact-description-error' : undefined}
                              className={cn(inputStyles, 'resize-none', errors.description ? 'border-rust' : 'border-ink/15')}
                            />
                            {errors.description && (
                              <p id="contact-description-error" className="mt-1.5 text-[13px] text-rust">
                                {errors.description}
                              </p>
                            )}
                          </div>


                          {/* Server error */}
                          {status === 'error' && (
                            <div
                              aria-live="assertive"
                              className="flex items-center gap-2 border border-rust/30 bg-rust/5 px-3 py-2 text-rust text-sm"
                            >
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{serverError}</span>
                            </div>
                          )}

                          {/* reCAPTCHA v3 attribution (the floating badge is hidden in globals.css) */}
                          {RECAPTCHA_ENABLED && (
                            <p className="text-[11px] leading-snug text-ink-muted/70">
                              Protected by reCAPTCHA. Google&apos;s{' '}
                              <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-ink/25 underline-offset-2 transition-colors hover:text-ink"
                              >
                                Privacy Policy
                              </a>{' '}
                              and{' '}
                              <a
                                href="https://policies.google.com/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-ink/25 underline-offset-2 transition-colors hover:text-ink"
                              >
                                Terms
                              </a>{' '}
                              apply.
                            </p>
                          )}
                        </>
                      )}

                      {/* Actions */}
                      {step === 1 ? (
                        <Button
                          type="button"
                          variant="rust"
                          onClick={handleNext}
                          className="group w-full rounded-none py-3.5 text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                        >
                          Next
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="group inline-flex items-center gap-1.5 rounded-none px-3 py-3.5 text-[15px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ink/30"
                          >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back
                          </button>
                          <Button
                            type="submit"
                            variant="rust"
                            className="flex-1 rounded-none py-3.5 text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                            disabled={status === 'submitting'}
                          >
                            {status === 'submitting' ? (
                              <>
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 w-5 h-5" />
                                Submit
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
