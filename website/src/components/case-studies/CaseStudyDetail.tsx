'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ArrowLeft, ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { caseStudies, type CaseStudy } from '@/data/caseStudies'
import { CaseStudiesCTA } from './CaseStudiesCTA'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function CaseStudyDetail({ study }: { study: CaseStudy }) {
  const others = caseStudies.filter((s) => s.slug !== study.slug)

  return (
    <>
      {/* Hero: full viewport, centered, metrics-led (the outcome up front) */}
      <section
        data-surface="paper"
        className="flex min-h-dvh flex-col bg-paper px-8 pt-32 pb-14 sm:px-12 lg:pl-32 lg:pr-24 lg:pt-36 lg:pb-16 xl:pl-40"
      >
        {/* Centered cover */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Flanked masthead kicker: the solution line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-4"
          >
            <span aria-hidden="true" className="hidden h-px w-10 shrink-0 bg-ink/25 sm:block" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              {study.category} for {study.company}
            </span>
            <span aria-hidden="true" className="hidden h-px w-10 shrink-0 bg-ink/25 sm:block" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-5xl font-serif text-6xl font-medium leading-[1.0] tracking-[-0.02em] text-ink sm:text-7xl lg:text-8xl"
          >
            {study.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 max-w-2xl text-xl leading-snug text-ink-muted sm:text-2xl"
          >
            {study.tagline}
          </motion.p>

          {/* Actions: orange primary (Visit an external live site, or Read More
              which scrolls into the case study when there is no public link) +
              a "Back to Case Studies" text-link (landing-hero style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-x-8 gap-y-5 sm:flex-row"
          >
            {study.visitUrl ? (
              <a
                href={study.visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-none bg-rust px-[30px] py-4 text-[15px] font-semibold text-paper transition-colors duration-300 hover:bg-rust/90"
              >
                Visit
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <Button
                variant="rust"
                onClick={() =>
                  document
                    .getElementById('case-study')
                    ?.scrollIntoView({ behavior: 'instant', block: 'start' })
                }
                className="group gap-2 rounded-none px-[30px] py-4 text-[15px] font-semibold"
              >
                Read More
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            )}
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink transition-colors hover:text-rust hover:border-rust"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Case Studies
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The Brief: full-width Challenge | Solution spread + tech.
          id/scroll-mt is the target for the hero "Read More" button. */}
      <section
        id="case-study"
        data-surface="paper"
        className="scroll-mt-24 border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-12 flex items-baseline justify-between gap-6 border-y border-ink/10 py-3 font-mono text-[10px] uppercase tracking-[0.14em] lg:mb-16"
        >
          <span className="text-ink">The Brief</span>
          <span className="text-right text-ink-muted">
            {study.company} <span className="text-ink/30">·</span> {study.category}
          </span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-x-12 gap-y-12 lg:grid-cols-2 lg:divide-x lg:divide-ink/10"
        >
          <div className="lg:pr-12">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              The Challenge
            </div>
            <p className="text-base leading-relaxed text-ink sm:text-lg first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.7] first-letter:text-ink">
              {study.challenge}
            </p>
          </div>
          <div className="lg:pl-12">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              Our Solution
            </div>
            <p className="text-base leading-relaxed text-ink sm:text-lg">
              {study.solution}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 border-t border-ink/10 pt-6"
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            Built with
          </div>
          <div className="flex flex-wrap gap-2">
            {study.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-none border border-ink/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* The Outcome: full-width results register */}
      <section
        data-surface="paper"
        className="border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-12 flex items-baseline justify-between gap-6 border-y border-ink/10 py-3 font-mono text-[10px] uppercase tracking-[0.14em] lg:mb-16"
        >
          <span className="text-ink">The Outcome</span>
          <span className="text-right text-ink-muted">Results</span>
        </motion.div>

        <motion.ol
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-14"
        >
          {study.results.map((result, i) => (
            <li key={result} className="flex gap-5 border-b border-ink/10 py-5">
              <span className="font-mono text-2xl leading-none text-ink/35">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] leading-relaxed text-ink sm:text-base">
                {result}
              </span>
            </li>
          ))}
        </motion.ol>
      </section>

      {/* More case studies: dotted-leader index */}
      {others.length > 0 && (
        <section
          data-surface="paper"
          className="border-t border-ink bg-paper px-8 py-16 sm:px-12 lg:py-20 lg:pl-32 lg:pr-24 xl:pl-40"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            More Case Studies
          </p>
          <nav className="border-t border-ink/10">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/case-studies/${s.slug}`}
                className="group flex items-baseline gap-4 border-b border-ink/10 py-5"
              >
                <span className="font-serif text-xl font-medium text-ink transition-colors group-hover:text-rust sm:text-2xl">
                  {s.title}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-1 flex-1 self-center border-b border-dotted border-ink/25"
                />
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted transition-colors group-hover:text-rust">
                  {s.category}
                </span>
              </Link>
            ))}
          </nav>
        </section>
      )}

      <CaseStudiesCTA />
    </>
  )
}
