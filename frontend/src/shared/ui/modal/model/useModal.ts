import { useContext } from 'react'
import { ModalContext } from './modal-context'
import type { ModalContextValue } from './modal-context'

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
