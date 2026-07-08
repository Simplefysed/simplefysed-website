'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Solution } from '@/data/solutions'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function ChapterBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="border-t border-ink/10 pt-6"
    >
      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-[140px_1fr]">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted sm:pt-1">
          {label}
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  )
}

export function SolutionChapter({ solution }: { solution: Solution }) {
  return (
    <section
      data-surface="paper"
      className="relative border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      {/* Anchor target offset above the section so hash landings clear the
          fixed header. Next.js Link hash scrolling ignores scroll-margin. */}
      <span
        id={solution.slug}
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: '-6rem' }}
      />
      <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
        {/* Chapter rail: index, title, deck, spec sheet */}
        <div className="lg:col-span-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <p className="font-mono text-sm text-ink-muted">
              {solution.index} / 03
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl">
              {solution.title}
            </h2>
            <p className="mt-4 max-w-sm font-serif text-xl italic leading-snug text-ink">
              {solution.deck}
            </p>
            <div className="mt-10">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                What ships
              </div>
              <ul className="max-w-sm border-t border-ink/10 divide-y divide-ink/10">
                {solution.ships.map((item) => (
                  <li key={item} className="py-2.5 text-sm leading-snug text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Standardized chapter blocks */}
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="space-y-12">
            <ChapterBlock label="Description">
              <p className="max-w-2xl text-lg leading-relaxed text-ink">
                {solution.description}
              </p>
            </ChapterBlock>

            <ChapterBlock label="Why">
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                {solution.why}
              </p>
            </ChapterBlock>

            <ChapterBlock label="Best for">
              <ul className="max-w-2xl divide-y divide-ink/10">
                {solution.bestForList.map((item) => (
                  <li key={item} className="py-2.5 text-[15px] leading-snug text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </ChapterBlock>

            <ChapterBlock label="Result">
              <p className="max-w-2xl font-serif text-2xl font-medium leading-[1.2] tracking-[-0.01em] text-ink sm:text-3xl">
                {solution.result.statement}{' '}
                <span className="text-rust">{solution.result.accent}</span>
              </p>
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3">
                {solution.result.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-mono text-2xl tracking-tight text-ink sm:text-3xl">
                      {metric.value}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </ChapterBlock>

            <ChapterBlock label="Examples">
              <div className="space-y-6">
                {solution.examples.map((example, i) => (
                  <article
                    key={example.title}
                    className="border border-ink/10 bg-paper-card p-6 sm:p-8"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                      Example {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-medium leading-snug text-ink">
                      {example.title}
                    </h3>
                    <div className="mt-4 space-y-3">
                      <p className="text-[15px] leading-relaxed text-ink-muted">
                        <span className="font-semibold text-ink">Situation.</span>{' '}
                        {example.situation}
                      </p>
                      <p className="text-[15px] leading-relaxed text-ink-muted">
                        <span className="font-semibold text-ink">We built.</span>{' '}
                        {example.built}
                      </p>
                      <p className="text-[15px] leading-relaxed text-ink-muted">
                        <span className="font-semibold text-ink">Outcome.</span>{' '}
                        {example.outcome}
                      </p>
                    </div>
                    {(example.visitUrl || example.moreHref) && (
                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                        {example.moreHref && (
                          <Link
                            href={example.moreHref}
                            className="inline-flex items-center justify-center rounded-none bg-rust px-[24px] py-[12px] text-[14px] font-semibold text-paper transition-colors duration-300 hover:bg-rust/90"
                          >
                            More Details
                          </Link>
                        )}
                        {example.visitUrl && (
                          <a
                            href={example.visitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/visit inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink hover:text-rust hover:border-rust transition-colors cursor-pointer"
                          >
                            See project
                            <ArrowRight className="w-4 h-4 group-hover/visit:translate-x-1 transition-transform" />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </ChapterBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
