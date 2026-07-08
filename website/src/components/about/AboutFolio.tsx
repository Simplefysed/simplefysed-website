'use client'

import { motion } from 'framer-motion'

// Page-specific motif: every about section opens with a thin broadsheet
// folio line instead of the site-wide kicker + triple headline anatomy.
export function AboutFolio({ left, right }: { left: string; right?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 flex items-baseline justify-between gap-6 border-y border-ink/10 py-3 font-mono text-[10px] uppercase tracking-[0.14em] lg:mb-16"
    >
      <span className="text-ink">{left}</span>
      {right && <span className="text-right text-ink-muted">{right}</span>}
    </motion.div>
  )
}
