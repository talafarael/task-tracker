import { apiRequest, configureApiAuth } from '@/shared/api/http-client'
import { useUserStore } from '../model/store'
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

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })

export const refresh = (): Promise<AuthResponse> =>
  apiRequest<AuthResponse>('/auth/refresh', { method: 'POST', auth: false })

export const logout = (): Promise<{ success: boolean }> =>
  apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' })

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
