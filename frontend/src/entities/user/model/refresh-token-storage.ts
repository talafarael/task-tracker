const REFRESH_TOKEN_KEY = 'refreshToken'

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (refreshToken: string): void =>
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

export const clearRefreshToken = (): void =>
  localStorage.removeItem(REFRESH_TOKEN_KEY)
