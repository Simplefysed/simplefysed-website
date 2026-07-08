'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { solutions } from '@/data/solutions'

export function SolutionsHero() {
  return (
    <section
      data-surface="paper"
      className="flex min-h-dvh flex-col bg-paper px-8 pt-32 pb-16 sm:px-12 lg:pl-32 lg:pr-24 lg:pt-36 lg:pb-16 xl:pl-40"
    >
      {/* Main block absorbs the spare viewport height so the contents nav
          below pins to the fold and the hero always spans one screen */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted"
        >
          Productized Solutions
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4rem]"
        >
          Three products.
          <br />
          <span className="italic text-ink-muted">Every engagement.</span>
          <br />
          Built to <span className="text-rust">ship.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          No sprawling catalog. No hourly guesswork. Three products, each
          presented in full: what it is, why it works, and what it returns.
        </motion.p>
      </div>

      {/* Contents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14"
      >
        <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Contents
        </div>
        <nav className="mx-auto max-w-2xl border-y border-ink/10 divide-y divide-ink/10">
          {solutions.map((solution) => (
            <a
              key={solution.slug}
              href={`#${solution.slug}`}
              className="group flex items-baseline gap-5 py-4 text-ink transition-colors hover:text-rust"
            >
              <span className="font-mono text-sm text-ink-muted">
                {solution.index}
              </span>
              <span className="font-serif text-xl font-medium sm:text-2xl">
                {solution.title}
              </span>
              <ArrowDown className="ml-auto h-4 w-4 self-center opacity-50 transition-transform group-hover:translate-y-0.5" />
            </a>
          ))}
        </nav>
      </motion.div>
    </section>
  )
}
