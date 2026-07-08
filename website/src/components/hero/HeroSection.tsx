'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { HeroContent } from './HeroContent'

export function HeroSection() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-paper border-b border-ink">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] min-h-dvh">
        {/* LEFT: paper content */}
        <HeroContent />

        {/* RIGHT: isometric software-architecture graphic floating on the paper */}
        <div className="relative hidden lg:flex items-center justify-start overflow-hidden py-6 pr-8 pl-0 xl:pr-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center max-h-full"
          >
            <Image
              src="/hero-software-architecture.png"
              alt="Isometric diagram of Simplefysed's software architecture: dashboards, workflow orchestration, AI agents, integrations, and data infrastructure"
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 46vw, 0px"
              className="w-auto h-auto max-w-full max-h-[calc(100vh-6rem)] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
