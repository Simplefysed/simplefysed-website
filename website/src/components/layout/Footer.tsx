'use client'

import Link from 'next/link'
import { Linkedin, Instagram, Mail } from 'lucide-react'
import { Logo } from '@/components/ui'

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/#services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Opportunities', href: '/#opportunities' },
  ],
  services: [
    { label: 'Web Development', href: '/#services' },
    { label: 'Mobile Apps', href: '/#services' },
    { label: 'AI Solutions', href: '/#services' },
    { label: 'Custom Software', href: '/#services' },
  ],
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vin-m-587a70256/', icon: Linkedin },
    { label: 'Instagram', href: 'https://www.instagram.com/vin696', icon: Instagram },
    { label: 'Email', href: 'mailto:info@simplefysed.com', icon: Mail },
  ],
}

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-bg-tertiary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo variant={4} size={32} />
              <span className="font-bold text-lg text-text-primary">
                Simplefysed
              </span>
            </Link>
            <p className="text-text-secondary text-sm">
              Building the future with intelligent software solutions.
            </p>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              {footerLinks.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-neon-cyan transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bg-tertiary flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} Simplefysed Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-text-muted hover:text-text-secondary transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-text-muted hover:text-text-secondary transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
