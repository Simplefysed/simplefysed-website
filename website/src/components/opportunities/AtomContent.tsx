'use client'

import { ReactNode } from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { GradientText } from '@/components/ui'

// ── Value-prop data ─────────────────────────────────────

const valueProps = [
  {
    title: 'Ship in Weeks, Not Months',
    description: 'Rapid prototyping and AI-accelerated delivery',
  },
  {
    title: 'Scale Without Limits',
    description: 'Cloud-native architecture that grows with you',
  },
  {
    title: 'AI-Native by Default',
    description: 'Every solution enhanced with intelligent automation',
  },
]

// ── Panel wrapper ───────────────────────────────────────

type ClipDirection = 'right' | 'top' | 'left' | 'center'

interface AtomPanelProps {
  scrollProgress: MotionValue<number>
  enterStart: number
  enterEnd: number
  exitStart: number
  exitEnd: number
  children: ReactNode
  position: ClipDirection
  interactive?: boolean
}

/** Positional class sets for each panel placement */
const positionClasses: Record<ClipDirection, string> = {
  right:
    'right-[5%] top-1/2 -translate-y-1/2 w-full max-w-md text-left lg:right-[5%] lg:top-1/2 lg:-translate-y-1/2',
  top:
    'left-1/2 top-[8.5%] -translate-x-1/2 max-w-2xl text-center lg:left-1/2 lg:top-[8.5%] lg:-translate-x-1/2',
  left:
    'left-[5%] top-1/2 -translate-y-1/2 w-full max-w-md text-left lg:left-[5%] lg:top-1/2 lg:-translate-y-1/2',
  center:
    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-3xl text-center',
}

/** Responsive override: below lg all panels center at bottom */
const mobileOverride =
  'max-lg:left-1/2 max-lg:top-auto max-lg:bottom-[8%] max-lg:-translate-x-1/2 max-lg:translate-y-0 max-lg:text-center max-lg:max-w-lg max-lg:right-auto'

/** Clip-path wipe direction per position */
function useClipPath(
  scrollProgress: MotionValue<number>,
  enterStart: number,
  enterEnd: number,
  position: ClipDirection,
) {
  const clipVal = useTransform(scrollProgress, [enterStart, enterEnd], [100, 0])

  return useTransform(clipVal, (v: number) => {
    const p = Math.max(0, v)
    switch (position) {
      case 'right':
        return `inset(0 ${p}% 0 0)`       // wipe from left
      case 'top':
        return `inset(${p}% 0 0 0)`        // wipe from bottom
      case 'left':
        return `inset(0 0 0 ${p}%)`         // wipe from right
      case 'center':
        return `inset(0 ${p}% 0 0)`         // default wipe
    }
  })
}

function AtomPanel({
  scrollProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  children,
  position,
  interactive,
}: AtomPanelProps) {
  const opacity = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  )
  const scale = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [1.04, 1, 1, 0.97],
  )
  const blurVal = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [8, 0, 0, 6],
  )
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`)
  const clipPath = useClipPath(scrollProgress, enterStart, enterEnd, position)

  return (
    <motion.div
      style={{ opacity, scale, filter, clipPath }}
      className={`absolute ${positionClasses[position]} ${mobileOverride} px-6 ${
        interactive ? 'pointer-events-auto' : ''
      }`}
    >
      <div className="atom-panel relative">{children}</div>
    </motion.div>
  )
}

// ── Main export ─────────────────────────────────────────

interface AtomContentProps {
  scrollProgress: MotionValue<number>
}

export function AtomContent({ scrollProgress }: AtomContentProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Panel 1 - RIGHT: Problem statement */}
      <AtomPanel
        scrollProgress={scrollProgress}
        enterStart={0.18}
        enterEnd={0.23}
        exitStart={0.27}
        exitEnd={0.30}
        position="right"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold mb-3 leading-tight">
            We Don&apos;t Just Build{' '}
            <GradientText>Software.</GradientText>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            We engineer momentum. While others deliberate, we ship. While they
            maintain, we innovate. Your next breakthrough is one partnership away.
          </p>
        </div>
      </AtomPanel>

      {/* Panel 2 - TOP: Value propositions */}
      <AtomPanel
        scrollProgress={scrollProgress}
        enterStart={0.55}
        enterEnd={0.60}
        exitStart={0.64}
        exitEnd={0.67}
        position="top"
      >
        <div className="w-full">
          <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-center mb-4">
            Your Growth Is Our{' '}
            <GradientText>Mission</GradientText>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {valueProps.map((vp) => (
              <div
                key={vp.title}
                className="bg-bg-secondary/80 backdrop-blur-sm border border-bg-tertiary rounded-xl p-4 text-left"
              >
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">
                  {vp.title}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{vp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AtomPanel>

      {/* Panel 3 - LEFT: Join the ride */}
      <AtomPanel
        scrollProgress={scrollProgress}
        enterStart={0.82}
        enterEnd={0.88}
        exitStart={0.95}
        exitEnd={1.0}
        position="left"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold mb-3 leading-tight">
            Join the{' '}
            <GradientText>Ride</GradientText>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            We&apos;re a team of engineers, designers, and strategists who thrive
            on impossible deadlines and elegant solutions.
          </p>
        </div>
      </AtomPanel>
    </div>
  )
}
