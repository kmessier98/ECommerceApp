using ECommerceApp.Application.DTOs;
using FluentValidation;

namespace ECommerceApp.Application.Validators
{
    public class InscriptionDtoValidator : AbstractValidator<InscriptionDto>
    {
        public InscriptionDtoValidator() 
        {
            RuleFor(x => x.Prenom)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Le prénom est requis.")
                .MaximumLength(100).WithMessage("Le prénom ne doit pas dépasser 100 caractères.");
            RuleFor(x => x.Nom)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(100).WithMessage("Le nom ne doit pas dépasser 100 caractères.");
            RuleFor(x => x.Courriel)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Le courriel est requis.")
                .EmailAddress().WithMessage("Le courriel n'est pas valide.")
                .MaximumLength(256).WithMessage("Le courriel ne doit pas dépasser 256 caractères.");
            RuleFor(x => x.MotDePasse)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Le mot de passe est requis.")
                .MinimumLength(8).WithMessage("Le mot de passe doit contenir au moins 8 caractères.")
                .Matches(@"[A-Z]").WithMessage("Le mot de passe doit contenir au moins une lettre majuscule.")
                .Matches(@"[0-9]").WithMessage("Le mot de passe doit contenir au moins un chiffre.")
                .Matches(@"[^A-Za-z0-9]").WithMessage("Le mot de passe doit contenir au moins un caractère spécial (non alphabétique et non numérique).");
            RuleFor(x => x.AccepteConditions).Equal(true).WithMessage("Vous devez accepter les conditions d'utilisation.");
        }
    }
}
