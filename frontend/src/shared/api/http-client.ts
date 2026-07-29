import { API_BASE_URL } from '@/shared/config/env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiAuthHandler {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<string>
}

interface ApiRequestOptions extends RequestInit {
  /** Attach the access token and retry once via refresh on a 401. Defaults to true. */
  auth?: boolean
}

let authHandler: ApiAuthHandler | null = null

export const configureApiAuth = (handler: ApiAuthHandler): void => {
  authHandler = handler
}

const send = async <T>(path: string, options: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json')
  const body = isJson ? await response.json() : undefined

  if (!response.ok) {
    const message =
      (body as { message?: string | string[] } | undefined)?.message ??
      response.statusText
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message.join(', ') : message,
    )
  }

  return body as T
}

const withToken = (
  options: RequestInit,
  accessToken: string | null,
): RequestInit => ({
  ...options,
  headers: {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  },
})

export const apiRequest = async <T>(
  path: string,
  { auth = true, ...options }: ApiRequestOptions = {},
): Promise<T> => {
  if (!auth || !authHandler) {
    return send<T>(path, options)
  }

  const token = authHandler.getAccessToken()

  try {
    return await send<T>(path, withToken(options, token))
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const freshToken = await authHandler.refreshAccessToken()
      return send<T>(path, withToken(options, freshToken))
    }
    throw error
  }
}
