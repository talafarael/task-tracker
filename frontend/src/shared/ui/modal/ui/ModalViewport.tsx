import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalViewportProps {
  content: ReactNode | null
  onRequestClose: () => void
}

export const ModalViewport = ({ content, onRequestClose }: ModalViewportProps) => {
  useEffect(() => {
    if (!content) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, onRequestClose])

  if (!content) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-brown-900/50 p-4"
      onClick={onRequestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-brown-300/40 bg-cream-50 p-6 shadow-lg"
      >
        {content}
      </div>
    </div>
  )
}
