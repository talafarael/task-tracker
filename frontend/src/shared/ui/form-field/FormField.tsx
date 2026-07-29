import type { UseFormRegisterReturn } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
}

interface FormFieldProps {
  label: string
  errorMessage?: string
  registration: UseFormRegisterReturn
  kind?: 'input' | 'textarea' | 'select'
  type?: string
  autoComplete?: string
  rows?: number
  options?: SelectOption[]
}

const fieldClassName =
  'w-full rounded-md border border-brown-300/60 bg-cream-50 px-3 py-2 text-brown-900 outline-none transition-colors placeholder:text-brown-300 focus:border-brown-500'

export const FormField = ({
  label,
  errorMessage,
  registration,
  kind = 'input',
  type = 'text',
  autoComplete,
  rows = 3,
  options = [],
}: FormFieldProps) => (
  <label className="block space-y-1 text-left">
    <span className="text-sm font-medium text-brown-700">{label}</span>
    {kind === 'textarea' && (
      <textarea rows={rows} {...registration} className={fieldClassName} />
    )}
    {kind === 'select' && (
      <select {...registration} className={fieldClassName}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
    {kind === 'input' && (
      <input
        type={type}
        autoComplete={autoComplete}
        {...registration}
        className={fieldClassName}
      />
    )}
    {errorMessage && (
      <span className="block text-sm text-maroon-600">{errorMessage}</span>
    )}
  </label>
)
