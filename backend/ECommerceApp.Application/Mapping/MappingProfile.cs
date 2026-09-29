using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Test, TestDto>();
            CreateMap<CreateTestDto, Test>();
            CreateMap<UpdateTestDto, Test>();
            CreateMap<Utilisateur, UtilisateurDto>()
                .ForMember(dest => dest.Courriel, opt => opt.MapFrom(src => src.Email));
            CreateMap<Categorie, CategorieDto>();
        }
    }
}
