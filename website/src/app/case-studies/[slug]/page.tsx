'use client'

/**
 * Tailwind safelist - dynamic classes used via template literals.
 * Listing them here ensures they are compiled into the CSS bundle.
 *
 * bg-neon-cyan/10 bg-neon-green/10 bg-neon-purple/10
 * text-neon-cyan text-neon-green text-neon-purple
 * bg-neon-cyan bg-neon-green bg-neon-purple
 * border-l-neon-cyan border-l-neon-green border-l-neon-purple
 * hover:border-neon-cyan/50 hover:border-neon-green/50 hover:border-neon-purple/50
 * hover:text-neon-cyan hover:text-neon-green hover:text-neon-purple
 * md:grid-cols-3 md:grid-cols-4
 */

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button, GradientText, GlowEffect } from '@/components/ui'
import { CTASection } from '@/components/sections'

const caseStudyData: Record<string, {
  company?: string
  title: string
  category: string
  description: string
  challenge: string
  solution: string
  results: string[]
  metrics: { label: string; value: string }[]
  tech: string[]
  color: string
}> = {
  'schutzschild-brandenburg': {
    company: 'SCHUTZSCHILD Brandenburg',
    title: 'Civil Protection Platform',
    category: 'Web Development',
    description: 'A portfolio demo project showcasing a civil protection platform for Brandenburg, Germany, centralizing emergency warnings, volunteer coordination, and crisis communication in one accessible system.',
    challenge: 'As a portfolio demonstration, we set out to solve a real-world problem: Brandenburg lacks a unified digital platform for civil protection. Emergency information is fragmented across multiple agencies and websites, leaving citizens without centralized access to localized preparedness resources. There is no coordinated system for volunteer management during crises, and existing solutions fail to meet German accessibility standards (BITV 2.0) or GDPR requirements. In emergencies, every second counts and scattered information costs time.',
    solution: 'We built SCHUTZSCHILD Brandenburg as a fully functional demo, a modern, accessible Next.js 15 platform with Payload CMS 3 embedded directly in the application. The system integrates Germany\'s official NINA warning API for a live warning ticker, provides interactive preparedness checklists tailored by household size and risk profile, and features a full volunteer coordination portal ("Spontanhelfer") with skill tracking, availability management, and deployment readiness. 13 CMS collections with granular role-based access control across four user roles (Admin, Editor, Crisis Staff, Press Office) power the entire content workflow, from articles and events to GDPR-compliant newsletter distribution and emergency pages designed to function without JavaScript.',
    results: [
      'Delivered a fully functional MVP with 29 public-facing routes covering all civil protection topics for Brandenburg',
      'Built 13 CMS collections with granular role-based access control across 4 user roles (Admin, Editor, Crisis Staff, Press Office)',
      'Achieved WCAG 2.1 AA accessibility with high-contrast mode, dark mode, skip navigation, and BITV 2.0 compliance',
      'Complete GDPR compliance including double opt-in newsletter subscriptions, consent tracking, and full privacy policy',
      'Emergency pages designed to function without JavaScript for maximum reliability during crisis situations',
      'Scalable serverless architecture deployed on Vercel with Supabase PostgreSQL and transaction-mode connection pooling',
    ],
    metrics: [
      { label: 'Public Routes', value: '29' },
      { label: 'CMS Collections', value: '13' },
      { label: 'User Roles', value: '4' },
      { label: 'Accessibility', value: 'AA' },
    ],
    tech: ['Next.js', 'Payload CMS', 'Supabase', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Drizzle ORM', 'Vercel'],
    color: 'cyan',
  },
  'mietservice24': {
    company: 'Mietservice24',
    title: 'Equipment Rental Platform',
    category: 'Web Development',
    description: 'Built a full-stack booking platform that replaced an entirely manual phone-and-WhatsApp workflow with 24/7 online self-service for a regional equipment rental business.',
    challenge: 'Lück Mietservice 24 rents heavy equipment (trucks with cranes, lifting platforms, trench cutters, and wood chippers) across Brandenburg, Germany. Every booking relied on phone calls during business hours, manual calendar checks, and hand-written WhatsApp confirmations. There was no online presence, no self-service, no structured records, and no way to prevent double-bookings.',
    solution: 'We built a full-stack Next.js platform with an interactive calendar showing real-time availability from Supabase, a self-service booking flow with automated email confirmations via Resend, and one-click admin action links that eliminated all manual data entry. The platform also includes GDPR-compliant legal pages (Impressum, Datenschutz, AGB) required for German businesses.',
    results: [
      'Enabled 24/7 online booking so customers are no longer limited to business-hours phone calls',
      'Eliminated all manual data entry with structured forms stored directly in PostgreSQL',
      'Real-time interactive calendar prevents double-bookings automatically',
      'One-click email-based admin workflow to confirm or cancel bookings without a dashboard',
      'Full legal compliance with GDPR privacy policy, Impressum, and AGB from day one',
    ],
    metrics: [
      { label: 'Booking', value: '24/7' },
      { label: 'Availability', value: 'Real-time' },
      { label: 'Email Templates', value: '6' },
    ],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Resend', 'Tailwind CSS', 'Vercel'],
    color: 'cyan',
  },
  'realtalk': {
    company: 'Realtalk',
    title: 'AI Dating Companion App',
    category: 'Mobile App',
    description: 'Building a React Native dating app where users swipe on and chat with AI personas powered by a 5-node stateful agent graph, persistent episodic memory, and psychologically-driven conversations that evolve over hundreds of exchanges. Currently in active development.',
    challenge: 'Dating apps are stale. Every major platform relies on the same loop: swipe, match, exchange a few low-effort messages, ghost. Conversation quality is abysmal because neither side invests. Meanwhile, existing AI companion apps produce flat, compliant chatbots with no memory, no drives, and no psychological depth. They don\'t feel like people, they feel like customer service. The goal was to build AI personas that behave like real people with real psychology: personas that remember specific facts and quotes across hundreds of exchanges, have moods that shift based on what you say, get bored if you\'re boring, pursue you with competing psychological drives, and maintain a consistent voice and personality over time.',
    solution: 'We\'re building a React Native app on Expo with a Convex serverless backend powering a 5-node stateful agent graph. Every user message flows through drive computation (5 competing psychological motivations scored 0 to 100), semantic vector memory retrieval via Pinecone, an inner state assessor generating behavioral briefs, a response generator with a 3-tier trust-gated prompt system, and an async reflector that persists the exchange and tracks drive shifts. Each of the 15+ AI personas has a soul document defining their psychological core, a texting style document anchoring their voice, and 25+ structured memory fields that accumulate over time with a union-merge strategy preventing fact loss. The app features swipe-to-match UX, real-time token-by-token streaming with natural multi-bubble delivery delays, dual-channel messaging that transitions from in-app chat to SMS-style contact after trust-gated phone sharing, a meeting system with 116 places and drive-probabilistic acceptance, and cron-driven AI-initiated messages based on attachment style and drive thresholds.',
    results: [
      '5-node stateful AI agent graph processing every message through drive computation, vector memory retrieval, inner state assessment, response generation, and async reflection',
      '15+ unique AI personas each with soul documents, distinct personality traits, attachment styles, and calibrated texting voices',
      '25+ structured memory fields per conversation with union-merge strategy preventing fact loss across hundreds of exchanges',
      'Dual-channel messaging with shared memory where in-app match chat transitions to SMS-style contact chat when trust is earned',
      '3-provider AI failover chain ensuring response availability across multiple LLM providers',
      'Meeting system with 116 places across 8 categories where acceptance is drive-probabilistic, so a longing-dominant persona accepts 80% while a void-dominant accepts only 20%',
    ],
    metrics: [
      { label: 'AI Personas', value: '15+' },
      { label: 'Memory Fields', value: '25+' },
      { label: 'Agent Nodes', value: '5' },
      { label: 'Meeting Places', value: '116' },
    ],
    tech: ['React Native', 'Expo', 'Convex', 'Pinecone', 'OpenAI', 'TypeScript', 'Clerk', 'RevenueCat'],
    color: 'cyan',
  },
  'n8n-inquiry-automation': {
    company: 'French Hotel Evaluation Firm',
    title: 'AI Email Inquiry Automation',
    category: 'Automation',
    description: 'Built an n8n workflow that uses AI to classify incoming email inquiries, extract structured data, and auto-generate evaluation documents from Word templates for a hotel evaluation firm.',
    challenge: 'The client, a French hotel evaluation company, receives a high volume of project inquiry emails from hotel owners and operators. Each inquiry needs to be reviewed, categorized by project type, and formatted into a standardized evaluation document using the correct Word template before being passed to the internal team. This entire process was manual: staff read every email, decided the category, copy-pasted relevant details into Word documents, and forwarded them. It was slow, error-prone, and didn\'t scale.',
    solution: 'We designed and built an n8n workflow automation that connects to the client\'s email mailbox via IMAP, then pipes each incoming message through OpenAI\'s ChatGPT. The AI first determines whether the email is a genuine project inquiry or noise. For valid inquiries, it classifies the email into the appropriate category (matching the client\'s internal project types), extracts all relevant named fields (company name, hotel details, contact information, project scope, etc.), and outputs structured JSON. That JSON is then injected into the correct Word template using a REST API integration, producing a pre-filled evaluation document. The completed document is automatically sent to the client\'s evaluation team, ready for review.',
    results: [
      'Eliminated manual email triage so every incoming message is automatically screened and classified by AI',
      'Reduced document preparation from 15 to 20 minutes per inquiry to fully automated generation in seconds',
      'AI-powered category detection selects the correct Word template without human intervention',
      'Structured JSON extraction ensures consistent, error-free data formatting across all documents',
      'Seamless handoff to the evaluation team with pre-filled documents ready for immediate review',
    ],
    metrics: [
      { label: 'Processing', value: 'Fully Auto' },
      { label: 'Triage Speed', value: 'Seconds' },
      { label: 'Classification', value: 'AI-Powered' },
    ],
    tech: ['n8n', 'OpenAI', 'IMAP', 'REST API', 'Word Templates'],
    color: 'green',
  },
}

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const study = caseStudyData[slug]

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Case study not found</h1>
          <Link href="/case-studies">
            <Button variant="outline">Back to Case Studies</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-36 px-4 bg-bg-primary">
        <GlowEffect
          color={study.color as 'cyan' | 'purple' | 'green'}
          size="xl"
          blur="lg"
          className="top-1/4 right-1/4"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/case-studies" className="inline-flex items-center text-text-secondary hover:text-neon-cyan transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {study.company ? (
              <p className={`text-neon-${study.color} text-lg sm:text-xl font-medium tracking-wide uppercase mb-3`}>
                {study.company} - {study.category}
              </p>
            ) : (
              <span className={`px-3 py-1 text-sm font-medium bg-neon-${study.color}/10 rounded-full text-neon-${study.color} mb-4 inline-block`}>
                {study.category}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-text-primary">
              {study.title}
            </h1>
            <p className="text-text-secondary text-lg">
              {study.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics - straddle the section boundary, overlapping both hero and content equally */}
      <div className="relative z-30 -mt-20 -mb-20 px-4">
        <div className={`max-w-4xl mx-auto relative grid grid-cols-2 md:grid-cols-${study.metrics.length} gap-6`}>
          {study.metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl bg-bg-secondary border border-bg-tertiary p-6 text-center shadow-lg shadow-black/20"
            >
              <div className={`w-12 h-0.5 bg-neon-${study.color} mx-auto mb-4`} />
              <div className={`text-3xl sm:text-4xl font-bold font-display text-neon-${study.color} mb-2`}>
                {metric.value}
              </div>
              <div className="text-text-secondary text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="relative pt-36 pb-20 px-4 bg-bg-primary overflow-x-clip">
        {/* Section divider at the top of the content section */}
        <div className="absolute left-0 right-0 top-0 border-t border-bg-tertiary z-10" />

        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <GlowEffect
          color={study.color as 'cyan' | 'purple' | 'green'}
          size="lg"
          blur="lg"
          className="top-1/3 left-1/4 opacity-30"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              The <GradientText className={`text-neon-${study.color}`}>Challenge</GradientText>
            </h2>
            <div className={`rounded-xl bg-bg-secondary border border-bg-tertiary border-l-2 border-l-neon-${study.color} p-6 sm:p-8`}>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">{study.challenge}</p>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Our <GradientText className={`text-neon-${study.color}`}>Solution</GradientText>
            </h2>
            <div className={`rounded-xl bg-bg-secondary border border-bg-tertiary border-l-2 border-l-neon-${study.color} p-6 sm:p-8`}>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">{study.solution}</p>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              The <GradientText className={`text-neon-${study.color}`}>Results</GradientText>
            </h2>
            <div className="space-y-3">
              {study.results.map((result, index) => (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4 sm:p-5 flex items-start"
                >
                  <CheckCircle className={`w-5 h-5 text-neon-${study.color} mr-3 flex-shrink-0 mt-0.5`} />
                  <span className="text-text-secondary text-base sm:text-lg">{result}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Tech <GradientText className={`text-neon-${study.color}`}>Stack</GradientText>
            </h2>
            <div className="flex flex-wrap gap-3">
              {study.tech.map((tech) => (
                <span
                  key={tech}
                  className={`px-5 py-2.5 bg-bg-secondary border border-bg-tertiary rounded-lg text-text-primary text-sm font-medium transition-colors hover:border-neon-${study.color}/50 hover:text-neon-${study.color}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
