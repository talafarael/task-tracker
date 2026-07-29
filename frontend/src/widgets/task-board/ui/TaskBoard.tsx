import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/shared/api/http-client'
import { useToast } from '@/shared/ui/toast'
import { toDateString } from '@/shared/lib/date'
import { TASK_STATUS_OPTIONS, tasksApi } from '@/entities/task'
import type { Task, TaskStatus } from '@/entities/task'
import { CreateTaskButton } from '@/features/task-create'
import { TaskItem } from '@/features/task-item'
import { DateStrip } from './DateStrip'

type StatusFilter = TaskStatus | 'ALL'

const filterTabs: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  ...TASK_STATUS_OPTIONS,
]

export const TaskBoard = () => {
  const { notify } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('ALL')
  const [date, setDate] = useState(() => toDateString(new Date()))
  const requestIdRef = useRef(0)

  const loadTasks = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    try {
      const data = await tasksApi.listTasks({ date })
      if (requestIdRef.current === requestId) setTasks(data)
    } catch (err) {
      if (requestIdRef.current === requestId) {
        notify({
          variant: 'error',
          message: err instanceof ApiError ? err.message : 'Failed to load tasks',
        })
      }
    } finally {
      if (requestIdRef.current === requestId) setIsLoading(false)
    }
  }, [date, notify])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks()
  }, [loadTasks])

  const visibleTasks =
    filter === 'ALL' ? tasks : tasks.filter((task) => task.status === filter)

  const recurringTasks = visibleTasks.filter(
    (task) => task.template.type === 'RECURRING',
  )
  const specificTasks = visibleTasks.filter(
    (task) => task.template.type === 'SPECIFIC',
  )

  const handleCreated = () => {
    void loadTasks()
  }

  const handleUpdated = (task: Task) =>
    setTasks((current) => current.map((t) => (t.id === task.id ? task : t)))

  const handleDeleted = (id: string) =>
    setTasks((current) => current.filter((t) => t.id !== id))

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <DateStrip selectedDate={date} onSelect={setDate} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-brown-700 text-cream-50'
                  : 'bg-cream-200 text-brown-700 hover:bg-cream-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CreateTaskButton onCreated={handleCreated} />
      </div>

      {isLoading && <p className="text-brown-600">Loading tasks…</p>}

      {!isLoading && visibleTasks.length === 0 && (
        <p className="text-brown-600">No tasks here yet.</p>
      )}

      {!isLoading && recurringTasks.length > 0 && (
        <div className="space-y-3">
          {recurringTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {!isLoading && specificTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-brown-700">Specific</h2>
          <div className="space-y-3">
            {specificTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
