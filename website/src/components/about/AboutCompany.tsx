'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// The three verified production numbers, in house metric format. These double
// as the hero's closing band, the ledger that anchors the centered cover.
const ledger = [
  { value: '19', label: 'Agents in production' },
  { value: '3,876', label: 'Tasks automated / month' },
  { value: '~30', label: 'Hours returned / week' },
]

export function AboutCompany() {
  return (
    <section
      data-surface="paper"
      className="flex min-h-dvh flex-col bg-paper px-6 pt-32 pb-14 sm:px-8 lg:pt-36 lg:pb-16"
    >
      {/* Centered cover. The left-inset that the rest of the site uses is dropped
          here on purpose: this is the one hero composed on the centre line. */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* Masthead kicker, flanked by rules */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <span aria-hidden="true" className="h-px w-10 bg-ink/25" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted">
            The Company
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-ink/25" />
        </motion.div>

        {/* Thesis headline: the rust is spent on the payoff word */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-serif text-6xl font-medium leading-[0.95] tracking-[-0.02em] text-ink sm:text-7xl lg:text-8xl"
        >
          We build <span className="text-rust">less.</span>
        </motion.h1>

        {/* Deck */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-2xl font-serif text-xl italic leading-snug text-ink sm:text-2xl"
        >
          An odd promise from a software company. It is also the entire point.
        </motion.p>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted"
        >
          Simplefysed Solutions is a German software and AI engineering company
          built on one observation: companies rarely suffer from too little
          software. They suffer from too much of it. Three productized solutions
          carry every engagement, each one leaving you with fewer moving parts
          than you started with.
        </motion.p>

        {/* Proof link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9"
        >
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink transition-colors hover:text-rust hover:border-rust"
          >
            The proof lives in the work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Closing band: the verified-metric ledger, pinned to the fold */}
      <motion.dl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 divide-y divide-ink/10 border-t border-ink sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {ledger.map((item) => (
          <div key={item.label} className="px-6 py-6 text-center sm:py-7">
            <dt className="font-mono text-3xl tracking-tight text-ink sm:text-4xl">
              {item.value}
            </dt>
            <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              {item.label}
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}
