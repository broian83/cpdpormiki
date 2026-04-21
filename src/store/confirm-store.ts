import { create } from 'zustand'

interface ConfirmStore {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  confirmLabel: string
  cancelLabel: string
  variant: 'danger' | 'primary'
  confirm: (options: {
    title: string
    message: string
    onConfirm: () => void
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
  }) => void
  close: () => void
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  confirmLabel: 'Konfirmasi',
  cancelLabel: 'Batal',
  variant: 'primary',
  confirm: (options) => set({
    isOpen: true,
    title: options.title,
    message: options.message,
    onConfirm: options.onConfirm,
    confirmLabel: options.confirmLabel || 'Konfirmasi',
    cancelLabel: options.cancelLabel || 'Batal',
    variant: options.variant || 'primary'
  }),
  close: () => set({ isOpen: false })
}))
