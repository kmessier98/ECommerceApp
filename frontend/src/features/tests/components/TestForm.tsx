import { useState, type FormEvent } from 'react'
import { ApiError } from '@/lib/api-client'
import { Button } from '@/shared/components/Button'
import { useCreateTest } from '../api'

export function TestForm() {
  const [nom, setNom] = useState('')
  const createTest = useCreateTest()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createTest.mutate({ nom }, { onSuccess: () => setNom('') })
  }

  const errors = createTest.error instanceof ApiError ? createTest.error.errors : []

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          aria-label="Nom"
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <Button type="submit" disabled={createTest.isPending}>
          Ajouter
        </Button>
      </div>
      {errors.map((message) => (
        <p key={message} className="text-sm text-red-600">
          {message}
        </p>
      ))}
    </form>
  )
}
