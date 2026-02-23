'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { AtomContent } from './AtomContent'

const AtomCanvas = dynamic(() => import('./AtomCanvas'), { ssr: false })

export function OpportunitiesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const scrollProgressRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgressRef.current = reducedMotion ? 0.5 : v
  })

  if (reducedMotion) {
    return (
      <section
        id="opportunities"
        className="py-24 px-6 sm:px-8 lg:px-12 bg-bg-primary"
      >
        <StaticFallback />
      </section>
    )
  }

  return (
    <section
      id="opportunities"
      ref={containerRef}
      style={{ height: '320vh' }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-bg-primary">
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <AtomCanvas scrollProgressRef={scrollProgressRef} />
        </div>

        {/* Scroll-synced text panels */}
        <AtomContent scrollProgress={scrollYProgress} />

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
    </section>
  )
}

/** Reduced-motion fallback: static content, no 3D */
function StaticFallback() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
        We Don&apos;t Just Build{' '}
        <span className="text-neon-cyan">Software.</span>
      </h2>
      <p className="text-text-secondary text-lg max-w-2xl mx-auto">
        We engineer momentum. While others deliberate, we ship. While they
        maintain, we innovate. Your next breakthrough is one partnership away.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
        {[
          ['Ship in Weeks, Not Months', 'Rapid prototyping and AI-accelerated delivery'],
          ['Scale Without Limits', 'Cloud-native architecture that grows with you'],
          ['AI-Native by Default', 'Every solution enhanced with intelligent automation'],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="bg-bg-secondary border border-bg-tertiary rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
