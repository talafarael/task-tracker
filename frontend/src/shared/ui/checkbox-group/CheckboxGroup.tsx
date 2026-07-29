import type { UseFormRegisterReturn } from 'react-hook-form'

interface CheckboxOption {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label: string
  options: CheckboxOption[]
  registration: UseFormRegisterReturn
}

export const CheckboxGroup = ({
  label,
  options,
  registration,
}: CheckboxGroupProps) => (
  <div className="space-y-1 text-left">
    <span className="text-sm font-medium text-brown-700">{label}</span>
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-1.5 text-sm text-brown-700"
        >
          <input type="checkbox" value={option.value} {...registration} />
          {option.label}
        </label>
      ))}
    </div>
  </div>
)
