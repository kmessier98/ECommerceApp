using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Application.Models;
using ECommerceApp.Domain.Entities;
using FluentValidation;

namespace ECommerceApp.Application.Services
{
    public class PanierService : IPanierService
    {
        private readonly IValidator<ModifierArticlePanierDto> _modifierArticleValidator;
        private readonly IMapper _mapper;
        private readonly IPanierRepository _panierRepository;
        private readonly IProduitRepository _produitRepository;
        private readonly ICalculPanierService _calculPanierService;

        public PanierService(IValidator<ModifierArticlePanierDto> modifierArticleValidator,
                            IMapper mapper,
                            IPanierRepository panierRepository,
                            IProduitRepository produitRepository,
                            ICalculPanierService calculPanierService)
        {
            _modifierArticleValidator = modifierArticleValidator;
            _mapper = mapper;
            _panierRepository = panierRepository;
            _produitRepository = produitRepository;
            _calculPanierService = calculPanierService;
        }

        public async Task<PanierDto> AjouterArticle(ProprietairePanier proprietaire, AjouterArticlePanierDto dto)
        {
            var produit = await _produitRepository.FindByIdAsync(dto.ProduitId);

            if (produit == null)
                throw new NotFoundException(nameof(Produit), dto.ProduitId);

            var panier = await TrouverPanier(proprietaire);

            if (panier == null)
            {
                panier = new Panier { UtilisateurId = proprietaire.UtilisateurId, CleAnonyme = proprietaire.CleAnonyme };
                await _panierRepository.CreateAsync(panier);
            }

            var article = panier.Articles.SingleOrDefault(x => x.ProduitId == dto.ProduitId);

            if (article == null)
            {
                panier.Articles.Add(new ArticlePanier { PanierId = panier.Id, ProduitId = dto.ProduitId, Quantite = 1 });
            }
            else
            {
                article.Quantite += 1;
            }

            await _panierRepository.UpdateAsync(panier);
            return ConstruireDto(panier);
        }

        public async Task<PanierDto> ModifierArticle(ProprietairePanier proprietaire, int produitId, ModifierArticlePanierDto dto)
        {
            var result = await _modifierArticleValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var panier = await TrouverPanier(proprietaire);

            if (panier == null)
                throw new NotFoundException("Aucun panier trouvé.");

            var article = panier.Articles.SingleOrDefault(x => x.ProduitId == produitId);
            if (article == null)
                throw new NotFoundException($"Le produit {produitId} n'est pas dans le panier.");

            article.Quantite = dto.Quantite;

            await _panierRepository.UpdateAsync(panier);

            return ConstruireDto(panier);
        }

        public async Task<PanierDto> Get(ProprietairePanier proprietaire)
        {
            var panier = await TrouverPanier(proprietaire);

            if (panier == null)
                return new PanierDto();

            return ConstruireDto(panier);
        }

        public async Task<PanierDto> RetirerArticle(ProprietairePanier proprietaire, int produitId)
        {
            var panier = await TrouverPanier(proprietaire);

            if (panier == null)
                throw new NotFoundException("Aucun panier trouvé.");

            var article = panier.Articles.SingleOrDefault(x => x.ProduitId == produitId);
            if (article == null)
                throw new NotFoundException($"Le produit {produitId} n'est pas dans le panier.");

            panier.Articles.Remove(article);

            if (panier.Articles.Count == 0)
            {
                await _panierRepository.DeleteAsync(panier);
                return new PanierDto();
            }

            await _panierRepository.UpdateAsync(panier);
            return ConstruireDto(panier);
        }

        /// <summary>
        /// Transfère le panier d'un visiteur anonyme vers son compte, au moment où il se connecte
        /// ou s'inscrit (appelée par AuthController). Trois scénarios sont possibles :
        /// <list type="number">
        /// <item>Aucun panier anonyme pour cette clé → rien à faire.</item>
        /// <item>Un panier anonyme, mais l'utilisateur n'a pas de panier → l'utilisateur adopte le panier anonyme.</item>
        /// <item>Les deux paniers existent → les articles anonymes sont fusionnés dans le panier de l'utilisateur,
        /// puis le panier anonyme est supprimé.</item>
        /// </list>
        /// Dans tous les cas, il ne reste ensuite plus aucun panier lié à cette clé anonyme.
        /// </summary>
        /// <param name="cleAnonyme">La clé lue dans le cookie du panier anonyme.</param>
        /// <param name="utilisateurId">L'utilisateur qui vient de se connecter ou de s'inscrire.</param>
        public async Task Fusionner(Guid cleAnonyme, int utilisateurId)
        {
            // Scénario 1 : aucun panier anonyme.
            // La clé du cookie ne correspond à aucun panier, par exemple parce que le visiteur a retiré
            // tous ses articles (RetirerArticle supprime alors le panier). Il n'y a rien à fusionner.
            var panierAnonyme = await _panierRepository.GetByAsync(p => p.CleAnonyme == cleAnonyme);
            if (panierAnonyme == null) return;

            // Scénario 2 : un panier anonyme, mais l'utilisateur n'a pas encore de panier.
            // Inutile de copier les articles : le panier anonyme change simplement de propriétaire.
            // On retire la clé anonyme pour qu'il ne soit plus accessible par le cookie,
            // et on le rattache à l'utilisateur. C'est la même ligne en base, avec le même Id.
            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == utilisateurId);
            if (panier == null)
            {
                panierAnonyme.CleAnonyme = null;
                panierAnonyme.UtilisateurId = utilisateurId;
                await _panierRepository.UpdateAsync(panierAnonyme);

                return;
            }

            // Scénario 3 : les deux paniers existent.
            // On parcourt les articles du panier anonyme pour les reporter dans le panier de l'utilisateur.
            // Les produits sont comparés par ProduitId (et non par Id, qui identifie la ligne en base
            // et diffère toujours d'un panier à l'autre).
            foreach (var articleAnonyme in panierAnonyme.Articles)
            {
                var article = panier.Articles.SingleOrDefault(x => x.ProduitId == articleAnonyme.ProduitId);
                if (article == null)
                {
                    // Le produit n'est pas encore dans le panier de l'utilisateur : on ajoute un NOUVEL article.
                    panier.Articles.Add(new ArticlePanier
                    {
                        ProduitId = articleAnonyme.ProduitId,
                        Quantite = articleAnonyme.Quantite,
                    });
                }
                else
                {
                    // Le produit est déjà dans le panier de l'utilisateur : on additionne les quantités.
                    // C'est un choix : on ne fait ainsi rien perdre au client.
                    article.Quantite += articleAnonyme.Quantite;
                }
            }

            // On sauvegarde le panier de l'utilisateur AVANT de supprimer le panier anonyme : en cas
            // d'erreur entre les deux, on garde un panier en trop plutôt que de perdre des articles.
            // La suppression du panier anonyme supprime aussi ses articles (suppression en cascade).
            await _panierRepository.UpdateAsync(panier);
            await _panierRepository.DeleteAsync(panierAnonyme);
        }

        private PanierDto ConstruireDto(Panier panier)
        {
            var dto = _mapper.Map<PanierDto>(panier);
            dto.ResumePanier = _calculPanierService.Calculer(panier);
            return dto;
        }

        private async Task<Panier?> TrouverPanier(ProprietairePanier proprietaire)
        {
            if (proprietaire.UtilisateurId is int utilisateurId)
                return await _panierRepository.GetByAsync(p => p.UtilisateurId == utilisateurId);

            if (proprietaire.CleAnonyme is Guid cleAnonyme)
                return await _panierRepository.GetByAsync(c => c.CleAnonyme == cleAnonyme);

            return null;
        }
    }
}
