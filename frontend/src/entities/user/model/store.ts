import { create } from 'zustand'
import type { User } from './types'

export type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'guest'

interface UserState {
  user: User | null
  accessToken: string | null
  status: SessionStatus
  setStatus: (status: SessionStatus) => void
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  setStatus: (status) => set({ status }),
  setAuth: (user, accessToken) =>
    set({ user, accessToken, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null, accessToken: null, status: 'guest' }),
}))
