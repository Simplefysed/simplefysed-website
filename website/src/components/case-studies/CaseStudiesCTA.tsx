'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

export function CaseStudiesCTA() {
  const openModal = useContactStore((s) => s.openModal)

  return (
    <section
      data-surface="paper"
      className="border-t border-ink bg-paper px-8 py-24 sm:px-12 lg:py-28"
    >
      {/* Centered end plate, matching the About CTA */}
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

        <h2 className="font-serif text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl">
          Seen enough?
          <br />
          <span className="italic text-ink-muted">Let&apos;s build yours.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          One call is enough to scope it. You leave with a recommendation, a
          plan, and a price.
        </p>

        <div className="mt-9 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
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
            className="group inline-flex items-center gap-2 px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink transition-colors hover:text-rust hover:border-rust"
          >
            Schedule a call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
