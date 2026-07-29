import { Link } from 'react-router-dom'
import { RegisterForm } from '@/features/auth-register'
import { routes } from '@/shared/config/routes'

export const RegisterPage = () => (
  <div className="space-y-6 text-center">
    <h1 className="text-3xl">Register</h1>
    <RegisterForm />
    <p className="text-sm text-brown-600">
      Already have an account?{' '}
      <Link to={routes.login} className="font-medium text-brown-800 underline underline-offset-2">
        Log in
      </Link>
    </p>
  </div>
)
