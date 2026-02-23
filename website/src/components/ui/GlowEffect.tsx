'use client'

import { cn } from '@/lib/utils'

interface GlowEffectProps {
  color?: 'cyan' | 'purple' | 'green' | 'pink'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  blur?: 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}

export function GlowEffect({
  color = 'cyan',
  size = 'md',
  blur = 'md',
  className,
  animate = false,
}: GlowEffectProps) {
  const colors = {
    cyan: 'bg-neon-cyan',
    purple: 'bg-neon-purple',
    green: 'bg-neon-green',
    pink: 'bg-neon-pink',
  }

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  }

  const blurs = {
    sm: 'blur-2xl',
    md: 'blur-3xl',
    lg: 'blur-[100px]',
  }

  return (
    <div
      className={cn(
        'absolute rounded-full opacity-20 pointer-events-none',
        colors[color],
        sizes[size],
        blurs[blur],
        animate && 'animate-pulse-glow',
        className
      )}
    />
  )
}
