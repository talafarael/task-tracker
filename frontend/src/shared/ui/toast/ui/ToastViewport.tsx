import { useToast } from '../model/useToast'
import type { ToastVariant } from '../model/types'

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-sage-500/50 bg-sage-500/10',
  error: 'border-maroon-500/50 bg-maroon-500/10',
  info: 'border-brown-400/50 bg-brown-400/10',
}

export const ToastViewport = () => {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex animate-[toast-in_0.2s_ease-out] items-start gap-2 rounded-lg border bg-cream-50 p-3 text-sm text-brown-900 shadow-md ${variantStyles[toast.variant]}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismiss(toast.id)}
            className="text-lg leading-none text-brown-500 hover:text-brown-800"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
