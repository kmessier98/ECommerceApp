using ECommerceApp.Api.Constants;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Application.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanierController : ControllerBase
    {
        private readonly IPanierService _panierService;

        public PanierController(IPanierService panierService)
        {
            _panierService = panierService;
        }

        [HttpGet]
        public async Task<ActionResult<PanierDto>> Get()
        {
            var proprietaire = ObtenirProprietaire(creerCleSiAbsente: false);

            var panier = await _panierService.Get(proprietaire);
            return Ok(panier);
        }

        [HttpPost("articles")]
        public async Task<ActionResult<PanierDto>> AjouterArticle([FromBody] AjouterArticlePanierDto dto)
        {
            var proprietaire = ObtenirProprietaire(creerCleSiAbsente: true);

            var panier = await _panierService.AjouterArticle(proprietaire, dto);
            return Ok(panier);
        }

        [HttpPatch("articles/{produitId:int}")]
        public async Task<ActionResult<PanierDto>> ModifierArticle([FromRoute] int produitId, [FromBody] ModifierArticlePanierDto dto)
        {
            var proprietaire = ObtenirProprietaire(creerCleSiAbsente: false);

            var panier = await _panierService.ModifierArticle(proprietaire, produitId, dto);
            return Ok(panier);
        }

        [HttpDelete("articles/{produitId:int}")]
        public async Task<ActionResult<PanierDto>> RetirerArticle([FromRoute] int produitId)
        {
            var proprietaire = ObtenirProprietaire(creerCleSiAbsente: false);

            var panier = await _panierService.RetirerArticle(proprietaire, produitId);
            return Ok(panier);
        }

        /// <summary>
        /// Détermine à qui appartient le panier pour la requête courante. Les scénarios sont testés
        /// dans cet ordre, et le premier qui s'applique gagne :
        /// <list type="number">
        /// <item>Utilisateur connecté → (UtilisateurId, null).</item>
        /// <item>Visiteur anonyme avec un cookie de panier valide → (null, clé du cookie).</item>
        /// <item>Visiteur anonyme sans cookie, pendant un ajout d'article → (null, nouvelle clé), et le cookie est créé.</item>
        /// <item>Visiteur anonyme sans cookie, pour les autres actions → (null, null), soit « aucun panier ».</item>
        /// </list>
        /// </summary>
        /// <param name="creerCleSiAbsente">
        /// Vrai seulement pour les actions qui peuvent créer un panier (l'ajout d'un article).
        /// Un visiteur anonyme sans cookie reçoit alors une nouvelle clé, pour que le panier sur le
        /// point d'être créé puisse être retrouvé ensuite.
        /// Les actions de lecture, de modification et de retrait passent faux : sans cookie, il n'y a
        /// aucun panier sur lequel agir, et un visiteur qui n'ajoute rien ne reçoit pas de cookie.
        /// </param>
        /// <returns>
        /// Le propriétaire, ou (null, null) pour un visiteur anonyme sans panier, ce que le service
        /// interprète comme « aucun panier ».
        /// </returns>
        private ProprietairePanier ObtenirProprietaire(bool creerCleSiAbsente)
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Scénario 1 : l'utilisateur est connecté.
            // On utilise son panier utilisateur. Il a toujours priorité sur un éventuel cookie anonyme :
            // le panier anonyme est fusionné dans le sien à la connexion (voir AuthController).
            if (int.TryParse(claim, out var userId))
                return new ProprietairePanier(userId, null);

            // Scénario 2 : visiteur anonyme qui a déjà un panier (cookie présent).
            // On retrouve son panier grâce à la clé du cookie. Le cookie vient du navigateur, on ne peut
            // donc pas se fier à sa valeur : s'il ne contient pas un Guid valide, on le traite comme absent.
            if (Guid.TryParse(Request.Cookies[CookiesPanier.Nom], out Guid cleAnonyme))
                return new ProprietairePanier(null, cleAnonyme);

            // Scénario 3 : visiteur anonyme sans cookie qui ajoute son premier article.
            // On génère une nouvelle clé et on l'envoie dans un cookie, pour que le panier que le service
            // va créer puisse être retrouvé aux requêtes suivantes.
            if (creerCleSiAbsente)
            {
                // Contrairement à un id séquentiel, un Guid aléatoire ne se devine pas : personne ne peut
                // atteindre le panier d'un autre visiteur en modifiant son cookie. La clé agit comme un mot de passe.
                var newCleAnonyme = Guid.NewGuid();

                // HttpOnly : les scripts de la page ne peuvent pas lire la clé (protection contre le XSS).
                // Secure : envoyé seulement en HTTPS. SameSite Strict : même réglage que le cookie d'authentification.
                // Expires : sans date d'expiration, le cookie (et donc le panier) disparaîtrait à la fermeture du navigateur.
                // IsEssential : nécessaire au fonctionnement du panier, une politique de consentement ne le bloque donc pas.
                Response.Cookies.Append(CookiesPanier.Nom, newCleAnonyme.ToString(), new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddDays(30),
                    IsEssential = true
                });

                return new ProprietairePanier(null, newCleAnonyme);
            }

            // Scénario 4 : visiteur anonyme sans cookie, pour une lecture, une modification ou un retrait.
            // Il n'a pas de panier, et on ne crée pas de cookie pour rien. Avec (null, null), le service
            // considère qu'il n'y a aucun panier : Get renvoie un panier vide, et ModifierArticle et
            // RetirerArticle lèvent une NotFoundException (404).
            return new ProprietairePanier(null, null);
        }
    }
}
