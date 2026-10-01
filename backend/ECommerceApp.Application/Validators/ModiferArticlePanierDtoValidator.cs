using ECommerceApp.Application.DTOs;
using FluentValidation;

namespace ECommerceApp.Application.Validators
{
    public class ModiferArticlePanierDtoValidator : AbstractValidator<ModifierArticlePanierDto>
    {
        public ModiferArticlePanierDtoValidator()
        {
            RuleFor(x => x.Quantite)
                .GreaterThan(0)
                .WithMessage("La quantité doit être supérieur à 0"); ;
        }
    }
}
