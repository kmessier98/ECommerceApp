using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;

namespace ECommerceApp.Application.Services
{
    public class ProduitService : IProduitService
    {
        private readonly IMapper _mapper;
        private readonly IProduitRepository _produitRepository;

        public ProduitService(IMapper mapper, IProduitRepository produitRepository)
        {
            _mapper = mapper;
            _produitRepository = produitRepository;
        }

        public async Task<List<ProduitDto>> GetAll()
        {
            var entities = await _produitRepository.GetAllAsync();

            return _mapper.Map<List<ProduitDto>>(entities);
        }
    }
}
