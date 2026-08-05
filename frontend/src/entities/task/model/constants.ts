import type { DayOfWeek, TaskStatus, TaskType } from './types'

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
}

export const TASK_STATUS_OPTIONS = TASK_STATUSES.map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}))

export const TASK_TYPES: TaskType[] = ['RECURRING', 'PERIOD']

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  RECURRING: 'Recurring',
  PERIOD: 'Period',
}

export const TASK_TYPE_OPTIONS = TASK_TYPES.map((type) => ({
  value: type,
  label: TASK_TYPE_LABELS[type],
}))

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
}

export const DAY_OF_WEEK_OPTIONS = DAYS_OF_WEEK.map((day) => ({
  value: day,
  label: DAY_OF_WEEK_LABELS[day],
}))
