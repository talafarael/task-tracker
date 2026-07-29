import { RouterProvider } from 'react-router-dom'
import { ModalProvider } from '@/shared/ui/modal'
import { ToastProvider } from '@/shared/ui/toast'
import { router } from './providers/router'
import { SessionProvider } from './providers/SessionProvider'

export const App = () => (
  <ToastProvider>
    <ModalProvider>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </ModalProvider>
  </ToastProvider>
)
