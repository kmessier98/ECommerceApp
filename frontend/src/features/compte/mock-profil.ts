import type { ProfilComplement } from './types'

// TODO: replace with the API once it exposes the password change date and the communication preferences.
export const PROFIL_MOCK: ProfilComplement = {
  dateModificationMotDePasse: '2026-06-14',
  communications: { infolettre: true, suiviCommande: true },
}
