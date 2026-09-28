// Mirrors ECommerceApp.Application/DTOs/AuthDto.cs
// ECommerceApp.Application/DTOs/UtilisateurDto.cs
export interface Utilisateur {
  id: number
  prenom: string
  nom: string
  courriel: string
  dateCreation: string
}

export interface InscriptionInput {
  prenom: string
  nom: string
  courriel: string
  motDePasse: string
  accepteConditions: boolean
  infolettre: boolean
}

export interface ConnexionInput {
  courriel: string
  motDePasse: string
  resterConnecte: boolean
}
