'use client'

import { useEffect, useRef, useCallback } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { commands, processCommand, runDemoAnimation, runMatrixAnimation, runNasaApod, runHackSimulation, runScanAnalysis, runDecryptAnimation } from './commands'
import { useTerminalStore } from '@/stores/terminalStore'

export function WebCLI() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { history, commandHistory, historyIndex, isRunning, addToHistory, addCommand, setHistoryIndex, setIsRunning, clearHistory } = useTerminalStore()

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [history, scrollToBottom])

  useEffect(() => {
    // Initial welcome message
    if (history.length === 0) {
      const art = [
        '░██████╗██╗███╗░░░███╗██████╗░██╗░░░░░███████╗███████╗██╗░░░██╗███████╗███████╗██████╗░',
        '██╔════╝██║████╗░████║██╔══██╗██║░░░░░██╔════╝██╔════╝╚██╗░██╔╝██╔════╝██╔════╝██╔══██╗',
        '╚█████╗░██║██╔████╔██║██████╔╝██║░░░░░█████╗░░█████╗░░░╚████╔╝░███████╗█████╗░░██║░░██║',
        '░╚═══██╗██║██║╚██╔╝██║██╔═══╝░██║░░░░░██╔══╝░░██╔══╝░░░░╚██╔╝░░╚════██║██╔══╝░░██║░░██║',
        '██████╔╝██║██║░╚═╝░██║██║░░░░░███████╗███████╗██║░░░░░░░░██║░░░███████║███████╗██████╔╝',
      ]

      addToHistory('')
      addToHistory(`__HEADERBOX__${JSON.stringify(art)}__ENDHEADERBOX__`)
      addToHistory('')
      addToHistory('  Type \x1b[32mhelp\x1b[0m to see available commands')
      addToHistory('  Try \x1b[32mdemo --ai\x1b[0m for a live AI automation demo')
      addToHistory('')
    }
  }, [addToHistory, history.length])

  const handleCommand = useCallback(async (input: string) => {
    if (isRunning) return

    const trimmedInput = input.trim()
    addToHistory(`\x1b[32m❯\x1b[0m ${trimmedInput}`)
    addCommand(trimmedInput)

    if (!trimmedInput) {
      return
    }

    const { command, args } = processCommand(trimmedInput)

    if (!commands[command]) {
      addToHistory(`\x1b[31m  Command not found:\x1b[0m ${command}`)
      addToHistory('  Type \x1b[32mhelp\x1b[0m to see available commands.')
      addToHistory('')
      return
    }

    const handler = commands[command]
    const result = await handler(args)

    if (result.output.includes('__CLEAR__')) {
      clearHistory()
      return
    }

    if (result.isAsync) {
      setIsRunning(true)
      if (command === 'demo' && args.includes('--ai')) {
        for await (const line of runDemoAnimation()) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else if (command === 'matrix') {
        for await (const line of runMatrixAnimation()) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else if (command === 'nasa') {
        for await (const line of runNasaApod()) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else if (command === 'hack') {
        for await (const line of runHackSimulation()) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else if (command === 'scan') {
        for await (const line of runScanAnalysis(args[0] || '')) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else if (command === 'decrypt') {
        for await (const line of runDecryptAnimation()) {
          addToHistory(line)
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
      setIsRunning(false)
    } else {
      result.output.forEach((line) => addToHistory(line))
    }
  }, [addToHistory, addCommand, clearHistory, isRunning, setIsRunning])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(e.currentTarget.value)
      e.currentTarget.value = ''
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        e.currentTarget.value = commandHistory[newIndex] || ''
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        e.currentTarget.value = commandHistory[newIndex] || ''
      } else {
        setHistoryIndex(commandHistory.length)
        e.currentTarget.value = ''
      }
    }
  }, [handleCommand, commandHistory, historyIndex, setHistoryIndex])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const renderLine = (line: string, index: number) => {
    // Check for header box marker
    if (line.startsWith('__HEADERBOX__')) {
      const jsonStr = line.slice('__HEADERBOX__'.length, line.indexOf('__ENDHEADERBOX__'))
      const artLines: string[] = JSON.parse(jsonStr)
      return (
        <div key={index} className="mx-2 my-1">
          <div className="px-4 py-3">
            {artLines.map((artLine, i) => (
              <div key={i} className="font-mono text-neon-purple whitespace-pre text-base leading-[1.15]"
                dangerouslySetInnerHTML={{ __html: artLine.replace(/░/g, '<span class="invisible">░</span>') }}
              />
            ))}
          </div>
          <div className="relative border-t-[3px] border-neon-purple mt-8">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#050508] px-3 text-neon-purple text-base font-mono font-bold leading-none">Terminal v2.0</span>
          </div>
        </div>
      )
    }

    // Check for image marker
    const imgMatch = line.match(/__IMG:(.*?)__/)
    if (imgMatch) {
      return (
        <div key={index} className="py-2">
          <img
            src={imgMatch[1]}
            alt="NASA APOD"
            className="max-w-full max-h-64 rounded-lg border border-bg-tertiary"
          />
        </div>
      )
    }

    // Parse ANSI color codes
    const colorMap: Record<string, string> = {
      '\x1b[0m': '</span>',
      '\x1b[31m': '<span class="text-red-500">',
      '\x1b[32m': '<span class="text-neon-green">',
      '\x1b[33m': '<span class="text-yellow-500">',
      '\x1b[35m': '<span class="text-neon-purple">',
      '\x1b[36m': '<span class="text-neon-cyan">',
      '\x1b[90m': '<span class="text-text-muted">',
    }

    let html = line
    Object.entries(colorMap).forEach(([code, replacement]) => {
      html = html.split(code).join(replacement)
    })

    return (
      <div
        key={index}
        className="font-mono text-base text-text-primary whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }}
      />
    )
  }

  return (
    <TerminalWindow className="w-full mx-auto">
      <div className="flex flex-col h-[600px]">
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto cursor-text terminal-content"
          onClick={focusInput}
        >
          {history.map(renderLine)}
        </div>
        <div className="flex items-center font-mono text-base py-2 border-y-2 border-x-0 border-gray-700">
          <span className="text-white mr-2">❯</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-text-primary caret-white"
            style={{ outline: 'none' }}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </TerminalWindow>
  )
}
