import { create } from 'zustand'

interface TerminalState {
  history: string[]
  commandHistory: string[]
  historyIndex: number
  isRunning: boolean
  addToHistory: (line: string) => void
  addCommand: (command: string) => void
  setHistoryIndex: (index: number) => void
  setIsRunning: (running: boolean) => void
  clearHistory: () => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  history: [],
  commandHistory: [],
  historyIndex: -1,
  isRunning: false,
  addToHistory: (line) =>
    set((state) => ({ history: [...state.history, line] })),
  addCommand: (command) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      historyIndex: state.commandHistory.length + 1,
    })),
  setHistoryIndex: (index) => set({ historyIndex: index }),
  setIsRunning: (running) => set({ isRunning: running }),
  clearHistory: () => set({ history: [], historyIndex: -1 }),
}))
