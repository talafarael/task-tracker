export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskType = 'RECURRING' | 'SPECIFIC'

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface TaskTemplate {
  id: string
  title: string
  description: string | null
  type: TaskType
  points: number
  repeatDays: DayOfWeek[]
  isRequired: boolean
  startDate: string | null
  endDate: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  date: string
  status: TaskStatus
  templateId: string
  userId: string
  template: TaskTemplate
  createdAt: string
  updatedAt: string
}
