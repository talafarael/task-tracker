export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastInput {
  variant: ToastVariant
  message: string
  /** Auto-dismiss delay in ms. Set 0 to require a manual close. Defaults to 5000. */
  duration?: number
}

export interface Toast extends ToastInput {
  id: string
}
