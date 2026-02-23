'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Card, CardContent, Button, GradientText, ImageLightbox } from '@/components/ui'

const caseStudies = [
  {
    id: 'mietservice24',
    company: 'Mietservice24',
    title: 'Equipment Rental Platform',
    category: 'Web Development',
    description: 'Full-stack booking platform replacing manual phone-based workflows with 24/7 online self-service.',
    metrics: ['24/7 online booking', 'Zero manual data entry', 'Real-time availability'],
    image: '/case-studies/mietservice24.jpg',
  },
  {
    id: 'schutzschild-brandenburg',
    company: 'SCHUTZSCHILD Brandenburg',
    title: 'Civil Protection Platform',
    category: 'Web Development',
    description: 'Portfolio demo of a civil protection platform for Brandenburg with real-time warnings, volunteer coordination, and crisis communication.',
    metrics: ['29 public routes', '13 CMS collections', 'WCAG 2.1 AA'],
    image: '/case-studies/schutzschild-brandenburg.png',
  },
  {
    id: 'realtalk',
    company: 'Realtalk',
    title: 'AI Dating Companion App',
    category: 'Mobile App',
    description: 'AI dating app with 15+ psychologically-driven personas, persistent memory, and a 5-node stateful agent graph.',
    metrics: ['15+ AI personas', '5-node agent graph'],
    image: '/case-studies/realtalk.png',
  },
]

export function CaseStudyPreview() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured <GradientText>Case Studies</GradientText>
            </h2>
            <p className="text-text-secondary max-w-xl">
              Real results from real projects. See how we help businesses transform.
            </p>
          </div>
          <Link href="/case-studies">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/case-studies/${study.id}`}>
                <Card className="h-full group relative overflow-visible">
                  <div className="absolute top-0 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2">
                    <span className="px-3 py-1.5 text-xs font-medium bg-bg-secondary rounded-full text-text-primary border border-bg-tertiary whitespace-nowrap">
                      {study.category}
                    </span>
                  </div>
                  <div className="relative px-4 pt-6">
                    <div
                      className={`relative h-48 rounded-lg overflow-hidden bg-bg-tertiary border border-bg-tertiary ${'image' in study && study.image ? 'cursor-zoom-in' : ''}`}
                      onClick={'image' in study && study.image ? (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setLightbox({ src: study.image!, alt: study.title })
                      } : undefined}
                    >
                      {'image' in study && study.image ? (
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neon-cyan/10" />
                      )}
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-5 h-5 text-text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardContent>
                    {'company' in study && study.company && (
                      <p className="text-neon-cyan text-xs font-medium tracking-wide uppercase mb-1">
                        {study.company}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-neon-cyan transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4">
                      {study.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {study.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="px-2 py-1 text-xs bg-bg-tertiary rounded text-text-muted"
                        >
                          {metric}
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

      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? ''}
        onClose={() => setLightbox(null)}
      />
    </section>
  )
}
