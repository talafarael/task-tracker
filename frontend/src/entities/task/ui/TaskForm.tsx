import { useForm } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'
import { FormField } from '@/shared/ui/form-field'
import { CheckboxGroup } from '@/shared/ui/checkbox-group'
import { DAY_OF_WEEK_OPTIONS, TASK_TYPE_OPTIONS } from '../model/constants'
import type { DayOfWeek, TaskType } from '../model/types'

export interface TaskFormValues {
  title: string
  description: string
  type: TaskType
  points: number
  repeatDays: DayOfWeek[]
}

interface TaskFieldConfig {
  name: keyof TaskFormValues
  label: string
  kind?: 'input' | 'textarea' | 'select'
  type?: string
  rows?: number
  options?: { value: string; label: string }[]
  rules?: RegisterOptions<TaskFormValues, keyof TaskFormValues>
}

const fields: TaskFieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    rules: { required: 'Title is required' },
  },
  {
    name: 'description',
    label: 'Description',
    kind: 'textarea',
    rows: 2,
  },
  {
    name: 'type',
    label: 'Type',
    kind: 'select',
    options: TASK_TYPE_OPTIONS,
  },
  {
    name: 'points',
    label: 'Points',
    type: 'number',
    rules: {
      required: 'Points is required',
      valueAsNumber: true,
      min: { value: 0, message: 'Points cannot be negative' },
    },
  },
]

const DEFAULT_VALUES: TaskFormValues = {
  title: '',
  description: '',
  type: 'RECURRING',
  points: 10,
  repeatDays: [],
}

interface TaskFormProps {
  defaultValues?: TaskFormValues
  submitLabel: string
  pendingLabel: string
  onSubmit: (values: TaskFormValues) => Promise<void>
  onCancel?: () => void
}

export const TaskForm = ({
  defaultValues,
  submitLabel,
  pendingLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  })

  const type = watch('type')

  const submit = async (values: TaskFormValues) => {
    await onSubmit(values)
    if (!defaultValues) {
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          kind={field.kind}
          type={field.type}
          rows={field.rows}
          options={field.options}
          errorMessage={errors[field.name]?.message}
          registration={register(field.name, field.rules)}
        />
      ))}
      {type === 'RECURRING' && (
        <CheckboxGroup
          label="Repeat on"
          options={DAY_OF_WEEK_OPTIONS}
          registration={register('repeatDays')}
        />
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brown-600 px-4 py-2 font-medium text-cream-50 shadow-sm transition-colors hover:bg-brown-700 disabled:opacity-50"
        >
          {isSubmitting ? pendingLabel : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-brown-300 px-4 py-2 font-medium text-brown-700 transition-colors hover:bg-cream-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
