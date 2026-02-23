'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useContactStore } from '@/stores/contactStore'
import { Button, GradientText } from '@/components/ui'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  email: string
  company: string
  service: string
  description: string
}

interface FormErrors {
  name?: string
  email?: string
  service?: string
  description?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const SERVICE_OPTIONS = [
  'Web Development',
  'Mobile Apps',
  'AI Solutions',
  'Custom Software',
]

export function ContactModal() {
  const { isOpen, closeModal } = useContactStore()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    service: '',
    description: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
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
      setFormData({ name: '', email: '', company: '', service: '', description: '' })
      setErrors({})
      setStatus('idle')
      setServerError('')
    }, 300)
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.service) {
      errs.service = 'Please select a service.'
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters.'
    }
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('submitting')
    setServerError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  const inputStyles = 'w-full bg-bg-primary border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 transition-colors'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div
              className="bg-bg-secondary border border-bg-tertiary rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-t-2 border-t-neon-cyan shadow-[0_0_30px_rgba(0,255,242,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-2xl font-bold">
                  <GradientText>Get in Touch</GradientText>
                </h2>
                <button
                  onClick={handleClose}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-tertiary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-neon-green mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Message Sent!</h3>
                    <p className="text-text-secondary">We&apos;ll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Name <span className="text-neon-pink">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(inputStyles, errors.name ? 'border-neon-pink' : 'border-bg-tertiary')}
                      />
                      {errors.name && <p className="mt-1 text-sm text-neon-pink">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Email <span className="text-neon-pink">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(inputStyles, errors.email ? 'border-neon-pink' : 'border-bg-tertiary')}
                      />
                      {errors.email && <p className="mt-1 text-sm text-neon-pink">{errors.email}</p>}
                    </div>

                    {/* Company + Service side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-company" className="block text-sm font-medium text-text-secondary mb-1.5">
                          Company
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          placeholder="Your company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className={cn(inputStyles, 'border-bg-tertiary')}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-service" className="block text-sm font-medium text-text-secondary mb-1.5">
                          Service <span className="text-neon-pink">*</span>
                        </label>
                        <select
                          id="contact-service"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className={cn(
                            inputStyles,
                            'appearance-none cursor-pointer',
                            errors.service ? 'border-neon-pink' : 'border-bg-tertiary',
                            !formData.service && 'text-text-secondary/50'
                          )}
                        >
                          <option value="" disabled>Select a service</option>
                          {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {errors.service && <p className="mt-1 text-sm text-neon-pink">{errors.service}</p>}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="contact-description" className="block text-sm font-medium text-text-secondary mb-1.5">
                        Project Description <span className="text-neon-pink">*</span>
                      </label>
                      <textarea
                        id="contact-description"
                        rows={4}
                        placeholder="Tell us about your project..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={cn(inputStyles, 'resize-none', errors.description ? 'border-neon-pink' : 'border-bg-tertiary')}
                      />
                      {errors.description && <p className="mt-1 text-sm text-neon-pink">{errors.description}</p>}
                    </div>

                    {/* Server error */}
                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-neon-pink text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      glow
                      className="w-full"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
