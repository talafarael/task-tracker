import { createContext } from 'react'
import type { Toast, ToastInput } from './types'

export interface ToastContextValue {
  toasts: Toast[]
  notify: (toast: ToastInput) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
