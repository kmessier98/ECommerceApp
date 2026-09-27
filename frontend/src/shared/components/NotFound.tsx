import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
        Retour à l’accueil
      </Link>
    </div>
  )
}
