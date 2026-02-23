'use client'

import dynamic from 'next/dynamic'
import { HeroContent } from './HeroContent'

const HeroCanvas = dynamic(
  () => import('./HeroCanvas').then((mod) => mod.HeroCanvas),
  { ssr: false }
)

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-primary">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-neon-cyan/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Two-column grid layout - content takes more space */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] min-h-screen relative z-10">
        {/* LEFT: Content */}
        <HeroContent />

        {/* RIGHT: 3D Canvas - extends slightly into content area */}
        <div className="relative hidden lg:block lg:h-auto lg:min-h-screen order-first lg:order-last lg:-ml-16">
          <div className="absolute inset-0">
            <HeroCanvas />
          </div>
        </div>
      </div>
    </section>
  )
}
