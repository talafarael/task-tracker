import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { ApiError } from '@/shared/api/http-client'
import { useModal } from '@/shared/ui/modal'
import { useToast } from '@/shared/ui/toast'
import {
  DAY_OF_WEEK_LABELS,
  TASK_STATUS_OPTIONS,
  TaskForm,
  tasksApi,
} from '@/entities/task'
import type { Task, TaskFormValues, TaskStatus } from '@/entities/task'
import { authApi, useUserStore } from '@/entities/user'

interface TaskItemProps {
  task: Task
  onUpdated: (task: Task) => void
  onDeleted: (id: string) => void
}

const statusBadgeStyles: Record<TaskStatus, string> = {
  TODO: 'bg-brown-200/60 text-brown-800',
  IN_PROGRESS: 'bg-cream-300 text-brown-800',
  DONE: 'bg-sage-500/20 text-sage-600',
}

export const TaskItem = ({ task, onUpdated, onDeleted }: TaskItemProps) => {
  const { notify } = useToast()
  const { open, close, confirm } = useModal()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as TaskStatus
    try {
      const updated = await tasksApi.updateTaskStatus(task.id, status)
      onUpdated(updated)
      if (status === 'DONE' || task.status === 'DONE') {
        const user = await authApi.getCurrentUser()
        useUserStore.getState().setUser(user)
      }
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to update task',
      })
    }
  }

  const handleEditSubmit = async (values: TaskFormValues) => {
    try {
      const template = await tasksApi.updateTaskTemplate(task.templateId, {
        title: values.title,
        description: values.description || undefined,
        type: values.type,
        points: values.points,
        repeatDays: values.type === 'RECURRING' ? values.repeatDays : undefined,
        isRequired: values.isRequired,
        startDate: values.type === 'PERIOD' ? values.startDate || undefined : undefined,
        endDate: values.type === 'PERIOD' ? values.endDate || undefined : undefined,
      })
      onUpdated({ ...task, template })
      close()
      notify({ variant: 'success', message: 'Task updated' })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to update task',
      })
    }
  }

  const handleEditOpen = () => {
    open(
      <>
        <h2 className="mb-4 text-lg">Edit task</h2>
        <TaskForm
          defaultValues={{
            title: task.template.title,
            description: task.template.description ?? '',
            type: task.template.type,
            points: task.template.points,
            repeatDays: task.template.repeatDays,
            isRequired: task.template.isRequired,
            startDate: task.template.startDate ?? '',
            endDate: task.template.endDate ?? '',
          }}
          submitLabel="Save"
          pendingLabel="Saving…"
          onSubmit={handleEditSubmit}
          onCancel={close}
        />
      </>,
    )
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: `Delete "${task.template.title}"?`,
      description: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    })
    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    try {
      await tasksApi.deleteTask(task.id)
      onDeleted(task.id)
      notify({ variant: 'success', message: 'Task deleted' })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to update task',
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-brown-300/40 bg-cream-50 p-4">
      <div className="min-w-0 flex-1 space-y-1 text-left">
        <p className="font-medium text-brown-900">
          {task.template.title}{' '}
          <span className="text-xs font-normal text-brown-500">
            +{task.template.points} pts
          </span>
          {task.template.isRequired && (
            <span className="ml-2 rounded-full bg-maroon-600/10 px-2 py-0.5 text-xs font-medium text-maroon-600">
              Required
            </span>
          )}
        </p>
        {task.template.description && (
          <p className="break-words text-sm text-brown-600">
            {task.template.description}
          </p>
        )}
        {task.template.repeatDays.length > 0 && (
          <p className="text-xs text-brown-500">
            Repeats:{' '}
            {task.template.repeatDays
              .map((day) => DAY_OF_WEEK_LABELS[day])
              .join(', ')}
          </p>
        )}
        {task.template.startDate && task.template.endDate && (
          <p className="text-xs text-brown-500">
            {task.template.startDate} – {task.template.endDate}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`rounded-md border-0 px-2 py-1 text-sm font-medium ${statusBadgeStyles[task.status]}`}
        >
          {TASK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleEditOpen}
          className="text-sm font-medium text-brown-700 hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm font-medium text-maroon-600 hover:underline disabled:opacity-50"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
