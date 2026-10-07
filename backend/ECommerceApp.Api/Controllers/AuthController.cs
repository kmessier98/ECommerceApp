using ECommerceApp.Api.Constants;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IPanierService _panierService;

        public AuthController(IAuthService authService, IPanierService panierService)
        {
            _authService = authService;
            _panierService = panierService;
        }


        [HttpPost("inscription")]
        public async Task<ActionResult<UtilisateurDto>> Inscrire([FromBody] InscriptionDto dto)
        {
            var utilisateur = await _authService.Inscrire(dto);
            await FusionnerPanierAnonyme(utilisateur.Id);

            return CreatedAtAction(nameof(GetUtilisateurCourant), utilisateur);
        }

        [HttpPost("connexion")]
        public async Task<ActionResult<UtilisateurDto>> Connecter([FromBody] ConnexionDto dto)
        {
            var utilisateur = await _authService.Connecter(dto);
            await FusionnerPanierAnonyme(utilisateur.Id);

            return Ok(utilisateur);
        }

        [HttpPost("deconnexion")]
        public async Task<ActionResult> Deconnecter()
        {
            await _authService.Deconnecter();
            return NoContent();
        }

        [Authorize]
        [HttpGet("moi")]
        public async Task<ActionResult<UtilisateurDto>> GetUtilisateurCourant()
        {
            int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var utilisateur = await _authService.GetUtilisateurCourant(id);

            return Ok(utilisateur);
        }

        /// <summary>
        /// Rattache au compte le panier que le visiteur a rempli avant de se connecter ou de s'inscrire,
        /// puis supprime le cookie du panier anonyme. Appelée par Connecter et Inscrire.
        /// </summary>
        /// <param name="utilisateurId">
        /// L'Id du UtilisateurDto retourné par AuthService. On ne peut pas utiliser User ici : il est
        /// construit à partir du cookie d'authentification reçu au début de la requête, et le navigateur
        /// n'enverra le nouveau cookie qu'à la prochaine requête. Pendant la connexion, User est donc
        /// encore anonyme.
        /// </param>
        private async Task FusionnerPanierAnonyme(int utilisateurId)
        {
            // Pas de cookie, ou une valeur qui n'est pas un Guid valide (le cookie vient du navigateur,
            // on ne s'y fie pas) : le visiteur n'a pas de panier anonyme, il n'y a rien à fusionner.
            if (Guid.TryParse(Request.Cookies[CookiesPanier.Nom], out Guid cleAnonyme))
            {
                // Le service gère les cas possibles : aucun panier anonyme, adoption du panier anonyme
                // par l'utilisateur, ou fusion des deux paniers (voir PanierService.Fusionner).
                await _panierService.Fusionner(cleAnonyme, utilisateurId);

                // Après la fusion, plus aucun panier n'est lié à cette clé : le cookie ne sert plus à rien.
                // Après une déconnexion, le visiteur repartira ainsi d'un tout nouveau panier anonyme.
                // Delete envoie au navigateur le même cookie avec une date d'expiration déjà passée.
                Response.Cookies.Delete(CookiesPanier.Nom);
            }
        }
    }
}
