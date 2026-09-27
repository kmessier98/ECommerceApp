using AutoMapper;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Application.DTOs;

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
        }
    }
}
