import { TestForm } from './TestForm'
import { TestList } from './TestList'

export function TestsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Tests</h1>
      <TestForm />
      <TestList />
    </section>
  )
}
