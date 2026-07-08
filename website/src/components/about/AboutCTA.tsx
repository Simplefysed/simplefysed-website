'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

export function AboutCTA() {
  const openModal = useContactStore((s) => s.openModal)

  return (
    <section
      data-surface="paper"
      className="border-t border-ink bg-paper px-8 py-24 sm:px-12 lg:py-32"
    >
      {/* Centered end plate: the only centered composition on the site */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          Next Step
        </p>

        <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
          One founder. One call.
          <br />
          One plan. One <span className="text-rust">price.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          Bring the process that hurts the most. Thirty minutes later you will
          know what we would build, what it would cost, and whether it is
          worth doing.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Button
            variant="rust"
            onClick={() => openModal()}
            className="rounded-none px-[30px] py-4 text-[15px] font-semibold"
          >
            Start a Project
          </Button>
          <a
            href="https://calendly.com/vin-simplefysed/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink hover:text-rust hover:border-rust transition-colors cursor-pointer"
          >
            Schedule a call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/70">
          Simplefysed Solutions &middot; Germany
        </p>
      </motion.div>
    </section>
  )
}
