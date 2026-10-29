import { QueryClient } from '@tanstack/react-query'
import { ApiError, estServeurInjoignable } from './api-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Don't retry client errors (400/401/404/409): they won't succeed on a second try.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
      // Once retries are exhausted, an unreachable API is thrown during render so the router's
      // errorElement (ErreurServeur) replaces the page. Other errors stay in `query.error`.
      throwOnError: (error) => estServeurInjoignable(error),
    },
  },
})
