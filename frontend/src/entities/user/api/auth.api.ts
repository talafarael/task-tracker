import { apiRequest, configureApiAuth } from '@/shared/api/http-client'
import { useUserStore } from '../model/store'
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from '../model/refresh-token-storage'
import type { AuthResponse, User } from '../model/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name?: string
}

const persistSession = (session: AuthResponse): AuthResponse => {
  setRefreshToken(session.refreshToken)
  return session
}

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  }).then(persistSession)

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  }).then(persistSession)

export const hasRefreshToken = (): boolean => getRefreshToken() !== null

export const refresh = (): Promise<AuthResponse> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token available'))
  }

  return apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    auth: false,
    headers: { Authorization: `Bearer ${refreshToken}` },
  }).then(persistSession)
}

export const logout = (): Promise<{ success: boolean }> =>
  apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' }).finally(
    clearRefreshToken,
  )

export const getCurrentUser = (): Promise<User> =>
  apiRequest<User>('/auth/me')

configureApiAuth({
  getAccessToken: () => useUserStore.getState().accessToken,
  refreshAccessToken: async () => {
    const session = await refresh()
    useUserStore.getState().setAuth(session.user, session.accessToken)
    return session.accessToken
  },
})
