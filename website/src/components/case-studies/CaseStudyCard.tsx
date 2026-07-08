'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { CaseStudy } from '@/data/caseStudies'

interface CaseStudyCardProps {
  study: CaseStudy
  index: number
}

export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group"
    >
      <Link
        href={`/case-studies/${study.slug}`}
        className="flex h-full flex-col border border-ink/10 bg-paper-card p-7 transition-colors duration-300 hover:border-ink sm:p-8"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {study.company} <span className="text-ink/30">/</span> {study.category}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-bold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-rust">
          {study.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          {study.description}
        </p>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-2 border-t border-ink/10 pt-5">
          {study.metrics.slice(0, 3).map((metric) => (
            <div key={metric.label}>
              <div className="font-mono text-sm leading-tight text-ink">
                {metric.value}
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase leading-tight tracking-[0.08em] text-ink-muted">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-auto flex items-center gap-1.5 pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
          View Case Study
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </motion.article>
  )
}
