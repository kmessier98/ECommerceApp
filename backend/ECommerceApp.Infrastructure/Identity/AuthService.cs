using AutoMapper;
using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;

namespace ECommerceApp.Infrastructure.Identity
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<Utilisateur> _userManager;
        private readonly SignInManager<Utilisateur> _signInManager;
        private readonly IValidator<InscriptionDto> _inscriptionValidator;
        private readonly IValidator<ConnexionDto> _connexionValidator;
        private readonly IMapper _mapper;

        public AuthService(UserManager<Utilisateur> userManager,
                           SignInManager<Utilisateur> signInManager,
                           IValidator<InscriptionDto> inscriptionValidator,
                           IValidator<ConnexionDto> connexionValidator, 
                           IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _inscriptionValidator = inscriptionValidator;
            _connexionValidator = connexionValidator;
            _mapper = mapper;
        }

        public async Task<UtilisateurDto> Inscrire(InscriptionDto dto)
        {
            var result = await _inscriptionValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var existingUser = await _userManager.FindByEmailAsync(dto.Courriel);
            if (existingUser != null)
                throw new ConflictException("Un utilisateur avec ce courriel existe déjà.");

            var utilisateur = new Utilisateur
            {
                UserName = dto.Courriel,
                Email = dto.Courriel,
                Prenom = dto.Prenom,
                Nom = dto.Nom,
                Infolettre = dto.Infolettre,
                DateCreation = DateTime.UtcNow
            };

            var resultCreate = await _userManager.CreateAsync(utilisateur, dto.MotDePasse);
            if (!resultCreate.Succeeded)
                throw new ValidationException(resultCreate.Errors.Select(e => new ValidationFailure(e.Code, e.Description)));

            await _signInManager.SignInAsync(utilisateur, isPersistent: false); // Mets le cookie d'authentification pour l'utilisateur nouvellement créé

            return _mapper.Map<UtilisateurDto>(utilisateur); 
        }

        public async Task<UtilisateurDto> Connecter(ConnexionDto dto)
        {
            var result = await _connexionValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var signInResult = await _signInManager.PasswordSignInAsync(dto.Courriel, dto.MotDePasse, dto.ResterConnecte, lockoutOnFailure: true);
            if (signInResult.IsLockedOut)
                throw new UnauthorizedAppException("Compte temporairement verrouillé. Réessayez dans quelques minutes.");
            if (!signInResult.Succeeded)
                throw new UnauthorizedAppException("Courriel ou mot de passe invalide.");

            var utilisateur = await _userManager.FindByEmailAsync(dto.Courriel);
            return _mapper.Map<UtilisateurDto>(utilisateur);
        }

        public async Task Deconnecter()
        {
            await _signInManager.SignOutAsync(); // Supprime le cookie d'authentification
        }

        public async Task<UtilisateurDto> GetUtilisateurCourant(int id)
        {
            var utilisateur = await _userManager.FindByIdAsync(id.ToString());
            if (utilisateur == null)
                throw new NotFoundException(nameof(Utilisateur), id);

            return _mapper.Map<UtilisateurDto>(utilisateur);
        }

    }
}
