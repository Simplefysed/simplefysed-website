'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '19', label: 'Agents deployed' },
  { value: '3,876', label: 'Tasks / month' },
  { value: '~30', label: 'Hours saved / wk' },
]

export function HeroContent() {
  const openModal = useContactStore((s) => s.openModal)
  return (
    <div className="relative z-10 flex flex-col justify-center min-h-dvh px-8 sm:px-12 lg:pl-32 xl:pl-40 lg:pr-24 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="max-w-xl"
      >
        {/* serif headline */}
        <h1 className="font-serif text-ink font-medium leading-[1.02] tracking-[-0.02em] text-5xl sm:text-6xl lg:text-[4.2rem] mb-7 break-words">
          Fewer tools.
          <br />
          <span className="italic text-ink-muted">Fewer people.</span>
          <br />
          More <span className="text-rust">output.</span>
        </h1>

        {/* subhead */}
        <p className="text-ink-muted text-lg leading-relaxed max-w-lg mb-9">
          We craft cutting-edge web applications, mobile experiences, and AI
          solutions. They transform business operations and automate redundant
          company workflows.
        </p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center gap-6"
        >
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
            className="group inline-flex items-center gap-2 self-start sm:self-auto px-0.5 py-1 text-[15px] font-semibold text-ink border-b-[1.6px] border-ink hover:text-rust hover:border-rust transition-colors cursor-pointer"
          >
            Schedule a call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-14 pt-8 border-t border-ink/10 max-w-lg">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-xl sm:text-3xl text-ink tracking-tight">{s.value}</div>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
