'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'ink' | 'inkOutline' | 'rust'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ink', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      ink: 'bg-ink text-paper hover:bg-ink/90',
      inkOutline: 'border border-ink/25 text-ink hover:bg-ink/5',
      rust: 'bg-rust text-paper hover:bg-rust/90',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
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
