using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Enums;
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
            CreateMap<Produit, ProduitDto>()
               .ForMember(dest => dest.EnStock, opt => opt.MapFrom(src => CalculerEnStock(src.Id)))
               .ForMember(dest => dest.EnPromotion, opt => opt.MapFrom(src => CalculerEnPromotion(src.Id)))
               .ForMember(dest => dest.Badge, opt => opt.MapFrom(src => CalculerBadge(src.Id)))
               .ForMember(dest => dest.RangPopularite, opt => opt.MapFrom(src => CalculerPopularite(src.Id)))
               .ForMember(dest => dest.DateAjout, opt => opt.MapFrom(src => CalculerDateAjout(src.Id)))
               .ForMember(dest => dest.Couleur, opt => opt.MapFrom(src => CalculerCouleur(src.Id)));
            CreateMap<ArticlePanier, ArticlePanierDto>()
                .ForMember(dest => dest.Nom, opt => opt.MapFrom(src => src.Produit.Nom))
                .ForMember(dest => dest.Prix, opt => opt.MapFrom(src => src.Produit.Prix))
                .ForMember(dest => dest.Couleur, opt => opt.MapFrom(src => CalculerCouleur(src.ProduitId)))
                .ForMember(dest =>dest.Description, opt =>opt.MapFrom(src => CalculerDescription(src.ProduitId)));
            CreateMap<Panier, PanierDto>()
                .ForMember(dest => dest.ResumePanier, opt => opt.Ignore());
        }

        //TODO données fictif pour le moment...
        private bool CalculerEnStock(int productId)
        {
            return productId != 7;
        }

        //TODO données fictif pour le moment...
        private bool CalculerEnPromotion(int productId)
        {
            return productId == 2 || productId == 6;
        }

        //TODO données fictif pour le moment...
        private BadgeType? CalculerBadge(int productId)
        {
            if (productId == 1) return BadgeType.Nouveau;
            if (productId == 4) return BadgeType.Populaire;
            if (productId == 5) return BadgeType.StockLimite;
            if (productId == 7) return BadgeType.Rupture;

            return null;
        }

        //TODO données fictif pour le moment...
        private int CalculerPopularite(int productId)
        {
            //plus le chiffre est bas plus la pop
            // In the mock data, the popularity rank matches the product id.
            return productId;
        }

        //TODO données fictif pour le moment...
        private DateTime CalculerDateAjout(int productId)
        {
            return productId switch
            {
                1 => new DateTime(2026, 9, 20),
                2 => new DateTime(2026, 6, 2),
                3 => new DateTime(2026, 7, 14),
                4 => new DateTime(2026, 3, 10),
                5 => new DateTime(2026, 8, 28),
                6 => new DateTime(2026, 5, 5),
                7 => new DateTime(2026, 2, 18),
                8 => new DateTime(2026, 4, 22),
                _ => new DateTime(2026, 1, 1)
            };
        }

        //TODO données fictif pour le moment...
        private string CalculerCouleur(int productId)
        {
            return productId switch
            {
                1 => "#d8c7b3",
                2 => "#c5d0c8",
                3 => "#bccab0",
                4 => "#e3b572",
                5 => "#d7b8ab",
                6 => "#d9bf92",
                7 => "#b7bfcc",
                8 => "#ead0a0",
                _ => "#d8d8d8"
            };
        }

        //TODO données fictif pour le moment...
        private string CalculerDescription(int productId)
        {
            return productId switch
            {
                1 => "Couleur : charbon",
                2 => "Fait main · 350 ml", 
                3 => "Cire de soya · 45 h", 
                4 => "Goût riche · récolte 2026",
                5 => "Couleur : crème · 130 x 170 cm", 
                6 => "Érable massif · 40 x 25 cm",
                7 => "Taille : unique · 80 % laine", 
                8 => "Onctueux · 100 % pur érable", 
                _ => ""
            };
        }


    }
}
