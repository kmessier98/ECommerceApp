using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Services
{
    public class PanierService : IPanierService
    {
        private readonly IMapper _mapper;
        private readonly IPanierRepository _panierRepository;
        private readonly IProduitRepository _produitRepository;

        public PanierService(IMapper mapper, IPanierRepository panierRepository, IProduitRepository produitRepository)
        {
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

        public async Task<PanierDto> Get(int userId)
        {
            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == userId);

            if (panier == null)
                return new PanierDto();

            return _mapper.Map<PanierDto>(panier);
        }
    }
}
