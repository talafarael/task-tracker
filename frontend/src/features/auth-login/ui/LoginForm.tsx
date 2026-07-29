import { useForm } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ApiError, authApi, useUserStore } from '@/entities/user'
import { routes } from '@/shared/config/routes'
import { FormField } from '@/shared/ui/form-field'
import { useToast } from '@/shared/ui/toast'

interface LoginFormValues {
  email: string
  password: string
}

interface LoginFieldConfig {
  name: keyof LoginFormValues
  label: string
  type: string
  autoComplete: string
  rules: RegisterOptions<LoginFormValues, keyof LoginFormValues>
}

const fields: LoginFieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    rules: { required: 'Email is required' },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'current-password',
    rules: {
      required: 'Password is required',
      minLength: { value: 8, message: 'At least 8 characters' },
    },
  },
]

export const LoginForm = () => {
  const navigate = useNavigate()
  const setAuth = useUserStore((state) => state.setAuth)
  const { notify } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const session = await authApi.login(values)
      setAuth(session.user, session.accessToken)
      notify({ variant: 'success', message: `Welcome back, ${session.user.email}` })
      navigate(routes.home, { replace: true })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Something went wrong',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          type={field.type}
          autoComplete={field.autoComplete}
          errorMessage={errors[field.name]?.message}
          registration={register(field.name, field.rules)}
        />
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brown-600 px-5 py-2.5 font-medium text-cream-50 shadow-sm transition-colors hover:bg-brown-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}
