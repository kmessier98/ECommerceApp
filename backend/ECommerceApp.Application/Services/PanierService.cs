using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
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

        public PanierService(IValidator<ModifierArticlePanierDto> modifierArticleValidator, IMapper mapper, IPanierRepository panierRepository, IProduitRepository produitRepository)
        {
            _modifierArticleValidator = modifierArticleValidator;
            _mapper = mapper;
            _panierRepository = panierRepository;
            _produitRepository = produitRepository;
        }

        public async Task AjouterArticle(int userId, AjouterArticlePanierDto dto)
        {
            var produit = await _produitRepository.FindByIdAsync(dto.ProduitId);

            if (produit == null)
                throw new NotFoundException(nameof(Produit), dto.ProduitId);

            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == userId);

            if (panier == null)
            {
                panier = new Panier { UtilisateurId = userId };
                await _panierRepository.CreateAsync(panier);
            }

            panier.Articles.Add(new ArticlePanier { PanierId = panier.Id, ProduitId = dto.ProduitId, Quantite = dto.Quantite });

            await _panierRepository.UpdateAsync(panier);
        }
        public async Task ModifierArticle(int userId, int produitId, ModifierArticlePanierDto dto)
        {
            var result = await _modifierArticleValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == userId);

            if (panier == null)
                throw new NotFoundException($"Aucun panier trouvé pour l'utilisateur {userId}.");

            var article = panier.Articles.SingleOrDefault(x => x.ProduitId == produitId);
            if (article == null)
                throw new NotFoundException($"Le produit {produitId} n'est pas dans le panier.");

            article.Quantite = dto.Quantite;

            await _panierRepository.UpdateAsync(panier);
        }

        public async Task<PanierDto> Get(int userId)
        {
            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == userId);

            if (panier == null)
                return new PanierDto();

            return _mapper.Map<PanierDto>(panier);
        }

        public async Task RetirerArticle(int userId, int produitId)
        {
            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == userId);

            if (panier == null)
                throw new NotFoundException($"Aucun panier trouvé pour l'utilisateur {userId}.");

            var article = panier.Articles.SingleOrDefault(x => x.ProduitId == produitId);
            if (article == null)
                throw new NotFoundException($"Le produit {produitId} n'est pas dans le panier.");

            panier.Articles.Remove(article);

            if (panier.Articles.Count == 0)
            {
                await _panierRepository.DeleteAsync(panier);
            }
            else
            {
                await _panierRepository.UpdateAsync(panier);
            }
        }
    }
}
