'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface AccentTextProps {
  children: ReactNode
  className?: string
}

export function GradientText({ children, className }: AccentTextProps) {
  return (
    <span className={cn('text-neon-cyan', className)}>
      {children}
    </span>
  )
}

// Alias for backward compatibility
export const AccentText = GradientText
