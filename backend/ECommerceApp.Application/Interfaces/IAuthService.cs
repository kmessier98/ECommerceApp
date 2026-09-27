using ECommerceApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerceApp.Application.Interfaces
{
    public interface IAuthService
    {
        Task<UtilisateurDto> Inscrire(InscriptionDto dto);
        Task<UtilisateurDto> Connecter(ConnexionDto dto);
        Task Deconnecter();
        Task<UtilisateurDto> GetUtilisateurCourant(int id);
    }
}
