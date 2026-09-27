import { Button } from '@/shared/components/Button'
import { useDeleteTest, useTests } from '../api'

export function TestList() {
  const { data: tests, isPending, isError, error } = useTests()
  const deleteTest = useDeleteTest()

  if (isPending) return <p className="text-slate-500">Chargement…</p>
  if (isError) return <p className="text-red-600">Erreur : {error.message}</p>
  if (tests.length === 0) return <p className="text-slate-500">Aucun élément.</p>

  return (
    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {tests.map((test) => (
        <li key={test.id} className="flex items-center justify-between px-4 py-2">
          <span>{test.nom}</span>
          <Button
            variant="ghost"
            onClick={() => deleteTest.mutate(test.id)}
            disabled={deleteTest.isPending}
          >
            Supprimer
          </Button>
        </li>
      ))}
    </ul>
  )
}
