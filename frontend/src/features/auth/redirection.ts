export function destinationSure(retour: string | null): string {
  if (retour?.startsWith('/') && !retour.startsWith('//') && !retour.startsWith('/\\')) {
    return retour
  }

  return '/catalogue'
}
