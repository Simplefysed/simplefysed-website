'use client'

import { Fragment } from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AboutFolio } from './AboutFolio'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
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

interface MethodStep {
  index: string
  title: string
  body: string
  leaveWith: string
}

const steps: MethodStep[] = [
  {
    index: '01',
    title: 'Audit',
    body: 'We watch how work actually moves. Every workflow, every handoff, every place a task waits for a human to remember it. The firm that asked us for better templates learned six of its steps should not exist at all.',
    leaveWith: 'A findings memo and a target process design.',
  },
  {
    index: '02',
    title: 'Design',
    body: 'The surviving process gets its architecture: fewer steps, fewer tools, clear owners, and the exact seams where software takes over. Scope is fixed here. So is the price.',
    leaveWith: 'Architecture with a fixed scope and a fixed price.',
  },
  {
    index: '03',
    title: 'Build',
    body: 'Weekly increments you can click, in your repository from day one. No status theatre, no slide decks standing in for progress. MandateOS grew from an empty repository to mandateos.de on exactly this cadence, one working release at a time.',
    leaveWith: 'Working software every week.',
  },
  {
    index: '04',
    title: 'Run',
    body: 'Handover is engineered like a feature: documentation written for the next engineer, infrastructure on your accounts, every deployed agent logged, exceptions escalated to a human instead of failing silently.',
    leaveWith: 'A system your team owns and operates.',
  },
]

const gates = [
  'Gate 01 · Go or no-go',
  'Gate 02 · You approve the design',
  'Gate 03 · You accept working software',
]

function GateMark() {
  return (
    <span
      aria-hidden="true"
      className="h-2 w-2 shrink-0 rotate-45 border border-ink bg-paper"
    />
  )
}

export function AboutMethod() {
  return (
    <section
      data-surface="paper"
      className="relative border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      {/* Anchor target offset above the section so hash landings clear the
          fixed header. Next.js Link hash scrolling ignores scroll-margin. */}
      <span
        id="method"
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: '-6rem' }}
      />

      <AboutFolio left="The Method" right="Four phases · Three gates" />

      <div className="mb-14 lg:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.6rem]"
        >
          A straight line.{' '}
          <span className="italic text-ink-muted">
            With <span className="not-italic text-rust">exits.</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          Most process pages draw circles and arrows. Ours reads left to
          right, and at every gate you can leave with everything made so far.
          Nobody stays because leaving is hard.
        </motion.p>
      </div>

      {/* Desktop route: one hairline, three gate stations, an arrowhead */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="relative mb-12 hidden h-10 lg:block"
      >
        <span className="absolute inset-x-0 top-1/2 border-t border-ink/20" />
        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 bg-ink" />
        <ArrowRight
          className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1.5 text-ink"
          strokeWidth={1.5}
        />
        {gates.map((gate, i) => (
          <span
            key={gate}
            style={{ left: `${(i + 1) * 25}%` }}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 bg-paper px-3"
          >
            <GateMark />
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              {gate}
            </span>
          </span>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-y-10 lg:grid-cols-4 lg:gap-x-10"
      >
        {steps.map((step, i) => (
          <Fragment key={step.index}>
            <motion.article variants={itemVariants}>
              <div className="font-mono text-sm text-ink-muted">{step.index}</div>
              <h3 className="mt-3 font-serif text-3xl font-medium leading-[1.08] tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                You leave with
              </div>
              <p className="mt-1.5 border-t border-ink/10 pt-2.5 text-sm leading-snug text-ink">
                {step.leaveWith}
              </p>
            </motion.article>

            {/* Mobile gates: stations between the stacked steps */}
            {i < gates.length && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 lg:sr-only"
              >
                <GateMark />
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  {gates[i]}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
              </motion.div>
            )}
          </Fragment>
        ))}
      </motion.div>
    </section>
  )
}
