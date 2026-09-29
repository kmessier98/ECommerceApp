using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;

namespace ECommerceApp.Application.Services
{
    public class CategorieService : ICategorieService
    {
        private readonly IMapper _mapper;
        private readonly ICategorieRepository _categorieRepository;

        public CategorieService(IMapper mapper, ICategorieRepository categorieRepository)
        {
            _mapper = mapper;
            _categorieRepository = categorieRepository;
        }

        public async Task<List<CategorieDto>> GetAll()
        {
            var categories = await _categorieRepository.GetAllAsync();

            return _mapper.Map<List<CategorieDto>>(categories);
        }
    }
}
