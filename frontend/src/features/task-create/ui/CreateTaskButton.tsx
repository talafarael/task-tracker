import { ApiError } from '@/shared/api/http-client'
import { useModal } from '@/shared/ui/modal'
import { useToast } from '@/shared/ui/toast'
import { TaskForm, tasksApi } from '@/entities/task'
import type { TaskFormValues } from '@/entities/task'

interface CreateTaskButtonProps {
  onCreated: () => void
}

export const CreateTaskButton = ({ onCreated }: CreateTaskButtonProps) => {
  const { open, close } = useModal()
  const { notify } = useToast()

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      await tasksApi.createTaskTemplate({
        title: values.title,
        description: values.description || undefined,
        type: values.type,
        points: values.points,
        repeatDays: values.type === 'RECURRING' ? values.repeatDays : undefined,
        isRequired: values.isRequired,
      })
      onCreated()
      close()
      notify({ variant: 'success', message: 'Task created' })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to create task',
      })
    }
  }

  const handleOpen = () => {
    open(
      <>
        <h2 className="mb-4 text-lg">New task</h2>
        <TaskForm
          submitLabel="Add task"
          pendingLabel="Adding…"
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </>,
    )
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="rounded-md bg-brown-600 px-4 py-2 font-medium text-cream-50 shadow-sm transition-colors hover:bg-brown-700"
    >
      + Add task
    </button>
  )
}
