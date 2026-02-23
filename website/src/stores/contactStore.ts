import { create } from 'zustand'

interface ContactState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useContactStore = create<ContactState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
