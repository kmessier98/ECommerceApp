import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { CreateTestInput, Test, UpdateTestInput } from './types'

const ENDPOINT = '/api/tests'

export const testKeys = {
  all: ['tests'] as const,
  detail: (id: number) => [...testKeys.all, id] as const,
}

export function useTests() {
  return useQuery({
    queryKey: testKeys.all,
    queryFn: () => apiClient.get<Test[]>(ENDPOINT),
  })
}

export function useTest(id: number) {
  return useQuery({
    queryKey: testKeys.detail(id),
    queryFn: () => apiClient.get<Test>(`${ENDPOINT}/${id}`),
  })
}

export function useCreateTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTestInput) => apiClient.post<Test>(ENDPOINT, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testKeys.all }),
  })
}

export function useUpdateTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateTestInput & { id: number }) =>
      apiClient.put<Test>(`${ENDPOINT}/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testKeys.all }),
  })
}

export function useDeleteTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`${ENDPOINT}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testKeys.all }),
  })
}
