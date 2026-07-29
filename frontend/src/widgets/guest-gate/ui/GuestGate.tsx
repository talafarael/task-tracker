import { Link } from 'react-router-dom'
import { routes } from '@/shared/config/routes'

export const GuestGate = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
    <span className="text-5xl">🔒</span>
    <div className="space-y-2">
      <h1>Oops! You're not logged in</h1>
      <p className="text-brown-600">
        Log in or create an account to see your tasks.
      </p>
    </div>
    <div className="flex gap-3">
      <Link
        to={routes.login}
        className="rounded-md bg-brown-600 px-5 py-2.5 font-medium text-cream-50 shadow-sm transition-colors hover:bg-brown-700"
      >
        Log in
      </Link>
      <Link
        to={routes.register}
        className="rounded-md border border-brown-300 px-5 py-2.5 font-medium text-brown-700 transition-colors hover:bg-cream-200"
      >
        Register
      </Link>
    </div>
  </div>
)
