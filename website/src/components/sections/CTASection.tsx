'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button, GlowEffect, GradientText } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'

export function CTASection() {
  const openModal = useContactStore((s) => s.openModal)
  return (
    <section id="cta" className="py-24 px-6 sm:px-8 lg:px-12 bg-bg-secondary relative overflow-hidden">
      {/* Background effects */}
      <GlowEffect
        color="cyan"
        size="xl"
        blur="lg"
        className="top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-10"
      />
      <GlowEffect
        color="purple"
        size="lg"
        blur="lg"
        className="top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 opacity-10"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Outrun the{' '}
            <GradientText>Competition</GradientText>?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Let&apos;s build something that makes your competitors nervous.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" glow className="group" onClick={() => openModal()}>
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => openModal()}>
              Schedule a Discovery Call
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
