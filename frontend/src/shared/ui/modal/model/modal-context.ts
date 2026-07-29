import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
}

export interface ModalContextValue {
  open: (content: ReactNode, onRequestClose?: () => void) => void
  close: () => void
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export const ModalContext = createContext<ModalContextValue | null>(null)
