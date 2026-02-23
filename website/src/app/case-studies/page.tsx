'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, GradientText, GlowEffect, ImageLightbox } from '@/components/ui'
import { CTASection } from '@/components/sections'

const categories = ['All', 'Web Development', 'Mobile App', 'Automation']

const caseStudies = [
  {
    id: 'mietservice24',
    company: 'Mietservice24',
    title: 'Equipment Rental Platform',
    category: 'Web Development',
    description: 'Built a full-stack booking platform that replaced an entirely manual phone-and-WhatsApp workflow with 24/7 online self-service for a regional equipment rental business.',
    metrics: ['24/7 online booking', 'Real-time availability'],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Resend'],
    color: 'cyan',
    image: '/case-studies/mietservice24.jpg',
  },
  {
    id: 'schutzschild-brandenburg',
    company: 'SCHUTZSCHILD Brandenburg',
    title: 'Civil Protection Platform',
    category: 'Web Development',
    description: 'Portfolio demo showcasing a civil protection platform for Brandenburg, Germany, centralizing emergency warnings, volunteer coordination, and crisis communication in one accessible system.',
    metrics: ['29 public routes', '13 CMS collections', 'WCAG 2.1 AA'],
    tech: ['Next.js', 'Payload CMS', 'Supabase', 'TypeScript'],
    color: 'cyan',
    image: '/case-studies/schutzschild-brandenburg.png',
  },
{
    id: 'realtalk',
    company: 'Realtalk',
    title: 'AI Dating Companion App',
    category: 'Mobile App',
    description: 'React Native dating app where users swipe on and chat with AI personas powered by a stateful agent graph, persistent memory, and psychologically-driven conversations. Currently in active development.',
    metrics: ['15+ AI personas', '5-node agent graph'],
    tech: ['React Native', 'Expo', 'Convex', 'Pinecone'],
    color: 'cyan',
    image: '/case-studies/realtalk.png',
  },
  {
    id: 'n8n-inquiry-automation',
    company: 'French Hotel Evaluation Firm',
    title: 'AI Email Inquiry Automation',
    category: 'Automation',
    description: 'Built an n8n workflow that uses AI to classify incoming email inquiries, extract structured data, and auto-generate evaluation documents from Word templates for a hotel evaluation firm.',
    metrics: ['Fully automated', 'AI-powered classification'],
    tech: ['n8n', 'OpenAI', 'IMAP', 'REST API'],
    color: 'green',
    image: '/case-studies/n8n-automation.png',
  },
]

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  const filteredStudies = activeCategory === 'All'
    ? caseStudies
    : caseStudies.filter(study => study.category === activeCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 sm:px-8 lg:px-12 bg-bg-primary overflow-hidden">
        <GlowEffect
          color="purple"
          size="xl"
          blur="lg"
          className="top-1/4 right-1/4"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Case <GradientText>Studies</GradientText>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Real results from real projects. Explore how we&apos;ve helped businesses
              transform their digital presence and operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-12 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 sm:px-8 lg:px-12 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-neon-cyan text-bg-primary'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <Link href={`/case-studies/${study.id}`}>
                  <Card className="h-full group relative overflow-visible">
                    <div className="absolute top-0 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2">
                      <span className="px-3 py-1.5 text-xs font-medium bg-bg-secondary rounded-full text-text-primary border border-bg-tertiary whitespace-nowrap transition-colors group-hover:text-neon-cyan group-hover:border-neon-cyan/50">
                        {study.category}
                      </span>
                    </div>
                    <div className="relative px-4 pt-6">
                      <div
                        className={`relative h-48 rounded-lg overflow-hidden bg-neon-${study.color}/15 border border-bg-tertiary ${'image' in study && study.image ? 'cursor-zoom-in' : ''}`}
                        onClick={'image' in study && study.image ? (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setLightbox({ src: study.image!, alt: study.title })
                        } : undefined}
                      >
                        {'image' in study && study.image && (
                          <Image
                            src={study.image}
                            alt={study.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={90}
                            className="object-cover object-center"
                          />
                        )}
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-5 h-5 text-text-primary" />
                        </div>
                      </div>
                    </div>
                    <CardContent>
                      {'company' in study && study.company && (
                        <p className={`text-neon-${study.color} text-xs font-medium tracking-wide uppercase mb-1`}>
                          {study.company}
                        </p>
                      )}
                      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-neon-cyan transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4">
                        {study.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.metrics.map((metric) => (
                          <span
                            key={metric}
                            className="px-2 py-1 text-xs bg-bg-tertiary rounded text-neon-green"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {study.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-bg-primary rounded text-text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? ''}
        onClose={() => setLightbox(null)}
      />
    </>
  )
}
