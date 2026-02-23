'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button, GradientText } from '@/components/ui'
import { useContactStore } from '@/stores/contactStore'
import { ArrowRight, Mail } from 'lucide-react'

function TypedText({ prefix, words, delay = 80, startDelay = 800, pauseDelay = 2000 }: {
  prefix: string
  words: string[]
  delay?: number
  startDelay?: number
  pauseDelay?: number
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isActive, setIsActive] = useState(false)
  const wordIndexRef = useRef(0)
  const phaseRef = useRef<'typing' | 'paused' | 'deleting'>('typing')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsActive(true)
    }, startDelay)
    return () => clearTimeout(startTimer)
  }, [startDelay])

  useEffect(() => {
    if (!isActive) return

    const tick = () => {
      const currentWord = words[wordIndexRef.current]

      if (phaseRef.current === 'typing') {
        setDisplayedText(prev => {
          if (prev.length < currentWord.length) {
            return currentWord.slice(0, prev.length + 1)
          }
          phaseRef.current = 'paused'
          return prev
        })
      } else if (phaseRef.current === 'paused') {
        timeoutRef.current = setTimeout(() => {
          phaseRef.current = 'deleting'
          tick()
        }, pauseDelay)
        return
      } else if (phaseRef.current === 'deleting') {
        setDisplayedText(prev => {
          if (prev.length > 0) {
            return prev.slice(0, -1)
          }
          wordIndexRef.current = (wordIndexRef.current + 1) % words.length
          phaseRef.current = 'typing'
          return prev
        })
      }

      const nextDelay = phaseRef.current === 'deleting' ? delay / 2 : delay
      timeoutRef.current = setTimeout(tick, nextDelay)
    }

    tick()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isActive, words, delay, pauseDelay])

  return (
    <>
      {prefix}
      {displayedText}
      {isActive && (
        <motion.span
          className="inline-block w-[4px] bg-neon-cyan ml-0.5"
          style={{ height: '1em', verticalAlign: 'text-bottom' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </>
  )
}

export function HeroContent() {
  const openModal = useContactStore((s) => s.openModal)
  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start justify-center min-h-screen text-center lg:text-left px-6 sm:px-8 lg:pl-24 xl:pl-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
          <span className="block">Building the Future</span>
          <span className="block">with Intelligent</span>
          <GradientText className="block">
            <TypedText prefix="S" words={['oftware', 'ystems', 'olutions']} delay={100} startDelay={1000} pauseDelay={1500} />
          </GradientText>
        </h1>

        <p className="text-text-secondary text-lg sm:text-xl max-w-xl mb-8">
          We craft cutting-edge web applications, mobile experiences, and AI solutions
          that transform businesses and delight users.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <Button size="lg" glow className="group" onClick={() => openModal()}>
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => openModal()}>
            <Mail className="mr-2 w-5 h-5" />
            Contact Us
          </Button>
        </motion.div>
      </motion.div>

    </div>
  )
}
