import { useState } from 'react'
import type { ReactNode } from 'react'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ModalViewport } from '../ui/ModalViewport'
import { ModalContext } from './modal-context'
import type { ConfirmOptions, ModalContextValue } from './modal-context'

interface ModalState {
  content: ReactNode
  onRequestClose?: () => void
}

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [state, setState] = useState<ModalState | null>(null)

  const requestClose = () => {
    state?.onRequestClose?.()
    setState(null)
  }

  const open: ModalContextValue['open'] = (content, onRequestClose) => {
    setState({ content, onRequestClose })
  }

  const confirm = (options: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      const settle = (result: boolean) => {
        setState(null)
        resolve(result)
      }

      setState({
        content: (
          <ConfirmDialog
            title={options.title}
            description={options.description}
            confirmLabel={options.confirmLabel ?? 'Confirm'}
            cancelLabel={options.cancelLabel ?? 'Cancel'}
            variant={options.variant ?? 'default'}
            onConfirm={() => settle(true)}
            onCancel={() => settle(false)}
          />
        ),
        onRequestClose: () => settle(false),
      })
    })

  const value: ModalContextValue = { open, close: requestClose, confirm }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalViewport content={state?.content ?? null} onRequestClose={requestClose} />
    </ModalContext.Provider>
  )
}
