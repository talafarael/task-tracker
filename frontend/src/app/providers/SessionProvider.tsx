import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { authApi, useUserStore } from '@/entities/user'

interface SessionProviderProps {
  children: ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const setAuth = useUserStore((state) => state.setAuth)
  const setStatus = useUserStore((state) => state.setStatus)
  const status = useUserStore((state) => state.status)

  useEffect(() => {
    let cancelled = false

    if (!authApi.hasRefreshToken()) {
      setStatus('guest')
      return
    }

    setStatus('loading')
    authApi
      .refresh()
      .then((session) => {
        if (!cancelled) setAuth(session.user, session.accessToken)
      })
      .catch(() => {
        if (!cancelled) setStatus('guest')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'idle' || status === 'loading') {
    return null
  }

  return children
}
