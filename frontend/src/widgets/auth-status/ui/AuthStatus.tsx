import { useUserStore } from '@/entities/user'
import { LogoutButton } from '@/features/auth-logout'
import { DeductPointsButton } from '@/features/points-deduct'

export const AuthStatus = () => {
  const user = useUserStore((state) => state.user)

  return (
    <div className="flex items-center justify-between border-b border-brown-300/40 bg-brown-800 px-6 py-3 text-cream-50">
      <span className="text-sm">Logged in as {user?.email}</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-cream-100">
            🏆 {user?.points ?? 0} pts
          </span>
          <DeductPointsButton />
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
