using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;

namespace ECommerceApp.Application.Services
{
    public class PanierService : IPanierService
    {
        private readonly IMapper _mapper;
        private readonly IPanierRepository _panierRepository;

        public PanierService(IMapper mapper, IPanierRepository panierRepository)
        {
            _mapper = mapper;
            _panierRepository = panierRepository;
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
