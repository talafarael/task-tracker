import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, authApi, useUserStore } from '@/entities/user'
import { routes } from '@/shared/config/routes'
import { useToast } from '@/shared/ui/toast'

export const LogoutButton = () => {
  const navigate = useNavigate()
  const clearAuth = useUserStore((state) => state.clearAuth)
  const { notify } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogout = async () => {
    setIsSubmitting(true)
    try {
      await authApi.logout()
      notify({ variant: 'success', message: 'Logged out' })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to log out',
      })
    } finally {
      clearAuth()
      setIsSubmitting(false)
      navigate(routes.login, { replace: true })
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded-md border border-cream-100/30 px-3 py-1.5 text-sm font-medium text-cream-50 transition-colors hover:bg-cream-50/10 disabled:opacity-50"
    >
      {isSubmitting ? 'Logging out…' : 'Log out'}
    </button>
  )
}
