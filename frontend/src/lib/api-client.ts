const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * Error thrown for any non-2xx response. `errors` matches the backend's
 * ExceptionHandlingMiddleware shape: `{ "errors": ["..."] }`.
 */
export class ApiError extends Error {
  readonly status: number
  readonly errors: string[]

  constructor(status: number, errors: string[]) {
    super(errors[0] ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function parseErrors(response: Response): Promise<string[]> {
  try {
    const body = await response.json()
    if (Array.isArray(body?.errors)) return body.errors.map(String)
    if (body?.errors && typeof body.errors === 'object') {
      // ASP.NET ProblemDetails validation shape: { errors: { Field: ["msg"] } }
      return Object.values(body.errors).flat().map(String)
    }
    if (typeof body?.title === 'string') return [body.title]
  } catch {
    // Body wasn't JSON.
  }
  return [response.statusText || `HTTP ${response.status}`]
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) throw new ApiError(response.status, await parseErrors(response))
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' }),
}
