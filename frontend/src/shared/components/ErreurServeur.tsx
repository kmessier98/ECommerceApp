import { useRouteError } from 'react-router-dom'
import { estServeurInjoignable } from '@/lib/api-client'
import { Button } from './Button'

/**
 * Router errorElement: replaces the whole app (Navbar included, since it also loads data) when a
 * query finds the API unreachable, or when a render error escapes a page. The URL is kept, so
 * reloading retries the same page.
 */
export function ErreurServeur() {
  const error = useRouteError()
  const injoignable = estServeurInjoignable(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold">
        {injoignable ? 'Service momentanément indisponible' : 'Une erreur inattendue est survenue'}
      </h1>
      <p className="mt-2 text-slate-600">
        {injoignable
          ? 'Impossible de joindre le serveur. Réessayez dans quelques instants.'
          : 'Rechargez la page pour réessayer.'}
      </p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  )
}
