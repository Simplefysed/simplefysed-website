'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  children: ReactNode
  title?: string
  className?: string
}

export function TerminalWindow({
  children,
  title = 'simplefysed@terminal',
  className,
}: TerminalWindowProps) {
  return (
    <div className={cn('terminal-window shadow-2xl', className)}>
      <div className="terminal-header">
        <div className="flex gap-2">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-text-muted text-sm font-mono">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-neon-green text-xs font-mono">LIVE</span>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
