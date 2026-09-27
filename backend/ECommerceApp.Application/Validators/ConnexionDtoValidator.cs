using ECommerceApp.Application.DTOs;
using FluentValidation;

namespace ECommerceApp.Application.Validators
{
    public class ConnexionDtoValidator : AbstractValidator<ConnexionDto>
    {
        public ConnexionDtoValidator()
        {
            RuleFor(x => x.Courriel)
                .NotEmpty().WithMessage("Le courriel est requis.")
                .EmailAddress().WithMessage("Le courriel n'est pas valide.");
            RuleFor(x => x.MotDePasse)
                .NotEmpty().WithMessage("Le mot de passe est requis.");
        }
    }
}
