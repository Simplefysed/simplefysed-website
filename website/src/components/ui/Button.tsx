'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      primary: 'bg-neon-cyan text-bg-primary hover:bg-neon-cyan/90',
      secondary: 'bg-neon-purple text-white hover:bg-neon-purple/90',
      outline: 'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
      ghost: 'text-text-primary hover:bg-bg-tertiary',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-lg',
      lg: 'px-8 py-4 text-lg rounded-xl',
    }

    const glowStyles = glow
      ? variant === 'primary'
        ? 'shadow-[0_0_20px_rgba(0,255,242,0.5)] hover:shadow-[0_0_30px_rgba(0,255,242,0.7)]'
        : variant === 'secondary'
        ? 'shadow-[0_0_20px_rgba(128,0,255,0.5)] hover:shadow-[0_0_30px_rgba(128,0,255,0.7)]'
        : ''
      : ''

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], glowStyles, className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
