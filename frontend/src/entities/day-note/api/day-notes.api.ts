import { apiRequest } from '@/shared/api/http-client'
import type { DayNote } from '../model/types'

export const getDayNote = (date: string): Promise<DayNote> =>
  apiRequest<DayNote>(`/day-notes?date=${date}`)

export const saveDayNote = (date: string, text: string): Promise<DayNote> =>
  apiRequest<DayNote>('/day-notes', {
    method: 'PUT',
    body: JSON.stringify({ date, text }),
  })
