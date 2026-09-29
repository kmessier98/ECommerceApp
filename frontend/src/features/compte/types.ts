// No backend DTO yet: these fields are not exposed by the API (see mock-profil.ts).
export interface PreferencesCommunication {
  infolettre: boolean
  suiviCommande: boolean
}

export interface ProfilComplement {
  dateModificationMotDePasse: string
  communications: PreferencesCommunication
}
