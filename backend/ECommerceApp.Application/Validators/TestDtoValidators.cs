using FluentValidation;
using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Validators
{
    public class CreateTestDtoValidator : AbstractValidator<CreateTestDto>
    {
        public CreateTestDtoValidator()
        {
            RuleFor(x => x.Nom)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(256).WithMessage("Le nom ne peut pas dépasser 256 caractères.");
        }
    }

    public class UpdateTestDtoValidator : AbstractValidator<UpdateTestDto>
    {
        public UpdateTestDtoValidator()
        {
            RuleFor(x => x.Nom)
                .NotEmpty().WithMessage("Le nom est requis.")
                .MaximumLength(256).WithMessage("Le nom ne peut pas dépasser 256 caractères.");
        }
    }
}
