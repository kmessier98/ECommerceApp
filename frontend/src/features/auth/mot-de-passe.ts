// Must match InscriptionDtoValidator and the Identity password options in the backend's Program.cs.
export const REGLES_MOT_DE_PASSE: { libelle: string; test: (motDePasse: string) => boolean }[] = [
  { libelle: '8 caractères minimum', test: (m) => m.length >= 8 },
  { libelle: 'Une majuscule', test: (m) => /[A-Z]/.test(m) },
  { libelle: 'Un chiffre', test: (m) => /\d/.test(m) },
  { libelle: 'Un caractère spécial', test: (m) => /[^A-Za-z0-9]/.test(m) },
]

export function motDePasseValide(motDePasse: string) {
  return REGLES_MOT_DE_PASSE.every((regle) => regle.test(motDePasse))
}
