'use client'

import { motion, Variants } from 'framer-motion'
import { aboutQuestions } from '@/data/about'
import { AboutFolio } from './AboutFolio'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export function AboutQuestions() {
  return (
    <section
      data-surface="paper"
      className="relative border-t border-ink bg-paper px-8 py-20 sm:px-12 lg:py-24 lg:pl-32 lg:pr-24 xl:pl-40"
    >
      {/* Anchor target offset above the section so hash landings clear the
          fixed header. Next.js Link hash scrolling ignores scroll-margin. */}
      <span
        id="questions"
        aria-hidden="true"
        className="absolute left-0"
        style={{ top: '-6rem' }}
      />

      <AboutFolio left="Common Questions" right="Six entries" />

      <div className="mb-14 lg:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.6rem]"
        >
          Asked. <span className="text-rust">Answered.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          Six questions from real first calls, answered in writing you can
          forward. Verdict first, mechanism after.
        </motion.p>
      </div>

      {/* Open on purpose: no accordions, every answer readable, findable,
          and forwardable. Two columns, like a reference spread. */}
      <motion.dl
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="grid gap-x-14 sm:grid-cols-2"
      >
        {aboutQuestions.map((item, i) => (
          <motion.div
            key={item.question}
            variants={itemVariants}
            className="border-t border-ink/10 py-8 sm:py-9"
          >
            <dt>
              <span className="font-mono text-[11px] text-ink-muted">
                Q.{String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-3 block max-w-md font-serif text-xl font-medium leading-snug tracking-[-0.01em] text-ink sm:text-2xl">
                {item.question}
              </span>
            </dt>
            <dd className="mt-3.5">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  )
}
