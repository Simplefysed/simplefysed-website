'use client'

import { forwardRef, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  variant?: 'default' | 'gradient' | 'glow'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const baseStyles = 'relative rounded-xl overflow-hidden'

    const variants = {
      default: 'bg-bg-secondary border border-bg-tertiary',
      gradient: 'bg-bg-secondary border border-neon-cyan',
      glow: 'bg-bg-secondary border-2',
    }

    const hoverStyles = hover
      ? 'transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,255,242,0.15)]'
      : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        whileHover={hover ? { y: -4 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }
