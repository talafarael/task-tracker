import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastViewport } from '../ui/ToastViewport'
import { ToastContext } from './toast-context'
import type { Toast, ToastInput } from './types'

const DEFAULT_DURATION = 5000

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID()
      const duration = input.duration ?? DEFAULT_DURATION

      setToasts((current) => [...current, { ...input, id }])

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}
