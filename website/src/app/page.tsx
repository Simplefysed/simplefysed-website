'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/hero'
import { WebCLI } from '@/components/terminal'
import { TechLogoSlider, ServicesSection, CTASection } from '@/components/sections'
import { OpportunitiesSection } from '@/components/opportunities'
import { GradientText } from '@/components/ui'

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Interactive CLI Section */}
      <section className="py-32 px-6 sm:px-8 lg:px-12 bg-bg-secondary relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />


        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Try Our <GradientText>Command Line</GradientText>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Experience a taste of our development philosophy. Explore our services,
              run demos, and see what we can build together.
            </p>
          </motion.div>

<motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <WebCLI />
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-text-muted text-sm mt-8 font-mono"
          >
            Press <kbd className="px-2 py-0.5 rounded bg-bg-tertiary text-neon-cyan">↑</kbd> / <kbd className="px-2 py-0.5 rounded bg-bg-tertiary text-neon-cyan">↓</kbd> to navigate command history
          </motion.p>
        </div>
      </section>

      <TechLogoSlider />
      <ServicesSection />
      <OpportunitiesSection />
      <CTASection />
    </>
  )
}
