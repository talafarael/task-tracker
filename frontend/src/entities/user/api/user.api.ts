import { apiRequest } from '@/shared/api/http-client'
import type { User } from '../model/types'

export interface DeductPointsPayload {
  amount: number
}

export const deductPoints = (payload: DeductPointsPayload): Promise<User> =>
  apiRequest<User>('/users/me/points', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
