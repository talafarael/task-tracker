export interface User {
  id: string
  email: string
  name: string | null
  points: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}
