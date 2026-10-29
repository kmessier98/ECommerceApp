import { BASE_URL } from './api-client'

export function imageUrl(path?: string | null) {
  return path ? `${BASE_URL}${path}` : '/placeholder.webp'
}
