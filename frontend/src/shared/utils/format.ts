const prixFormat = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

export function formatPrix(prix: number) {
  return prixFormat.format(prix)
}

const dateFormat = new Intl.DateTimeFormat('fr-CA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Formats an ISO date (`2026-09-26`) as `26 sept. 2026`. */
export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso))
}
