import { apiRequest } from '@/shared/api/http-client'
import type {
  DayOfWeek,
  Task,
  TaskStatus,
  TaskTemplate,
  TaskType,
} from '../model/types'

export interface CreateTaskTemplatePayload {
  title: string
  description?: string
  type?: TaskType
  points?: number
  repeatDays?: DayOfWeek[]
  isRequired: boolean
}

export type UpdateTaskTemplatePayload = Partial<CreateTaskTemplatePayload>

export interface TaskQuery {
  date: string
  status?: TaskStatus
}

const toQueryString = (query: TaskQuery): string => {
  const params = new URLSearchParams()
  params.set('date', query.date)
  if (query.status) params.set('status', query.status)
  return `?${params.toString()}`
}

export const listTasks = (query: TaskQuery): Promise<Task[]> =>
  apiRequest<Task[]>(`/tasks${toQueryString(query)}`)

export const updateTaskStatus = (
  id: string,
  status: TaskStatus,
): Promise<Task> =>
  apiRequest<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const deleteTask = (id: string): Promise<void> =>
  apiRequest<void>(`/tasks/${id}`, { method: 'DELETE' })

export const createTaskTemplate = (
  payload: CreateTaskTemplatePayload,
): Promise<TaskTemplate> =>
  apiRequest<TaskTemplate>('/task-templates', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateTaskTemplate = (
  id: string,
  payload: UpdateTaskTemplatePayload,
): Promise<TaskTemplate> =>
  apiRequest<TaskTemplate>(`/task-templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export const deleteTaskTemplate = (id: string): Promise<void> =>
  apiRequest<void>(`/task-templates/${id}`, { method: 'DELETE' })
