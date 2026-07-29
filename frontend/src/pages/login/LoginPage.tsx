import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth-login'
import { routes } from '@/shared/config/routes'

export const LoginPage = () => (
  <div className="space-y-6 text-center">
    <h1 className="text-3xl">Log in</h1>
    <LoginForm />
    <p className="text-sm text-brown-600">
      No account?{' '}
      <Link to={routes.register} className="font-medium text-brown-800 underline underline-offset-2">
        Register
      </Link>
    </p>
  </div>
)
