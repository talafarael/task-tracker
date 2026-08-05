import { useForm } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'
import { FormField } from '@/shared/ui/form-field'
import { CheckboxGroup } from '@/shared/ui/checkbox-group'
import {
  DAY_OF_WEEK_OPTIONS,
  DAYS_OF_WEEK,
  TASK_TYPE_OPTIONS,
} from '../model/constants'
import type { DayOfWeek, TaskType } from '../model/types'

export interface TaskFormValues {
  title: string
  description: string
  type: TaskType
  points: number
  repeatDays: DayOfWeek[]
  isRequired: boolean
  startDate: string
  endDate: string
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
  isRequired: false,
  startDate: '',
  endDate: '',
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  })

  const type = watch('type')
  const repeatDays = watch('repeatDays')
  const startDate = watch('startDate')
  const allDaysSelected = repeatDays?.length === DAYS_OF_WEEK.length

  const handleAllDaysChange = (checked: boolean) => {
    setValue('repeatDays', checked ? DAYS_OF_WEEK : [], {
      shouldDirty: true,
    })
  }

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
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-left">
            <input
              type="checkbox"
              checked={allDaysSelected}
              onChange={(event) => handleAllDaysChange(event.target.checked)}
              className="h-4 w-4 rounded border-brown-300/60 text-brown-600 focus:ring-brown-500"
            />
            <span className="text-sm font-medium text-brown-700">
              All days
            </span>
          </label>
          <CheckboxGroup
            label="Repeat on"
            options={DAY_OF_WEEK_OPTIONS}
            registration={register('repeatDays')}
          />
        </div>
      )}
      {type === 'PERIOD' && (
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Start date (optional)"
            type="date"
            errorMessage={errors.startDate?.message}
            registration={register('startDate')}
          />
          <FormField
            label="End date (optional)"
            type="date"
            errorMessage={errors.endDate?.message}
            registration={register('endDate', {
              validate: (value) =>
                !value || !startDate || value >= startDate ||
                'End date must be on or after start date',
            })}
          />
        </div>
      )}
      <label className="flex items-center gap-2 text-left">
        <input
          type="checkbox"
          {...register('isRequired')}
          className="h-4 w-4 rounded border-brown-300/60 text-brown-600 focus:ring-brown-500"
        />
        <span className="text-sm font-medium text-brown-700">
          Required task
        </span>
      </label>
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
