using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("inscription")]
        public async Task<ActionResult<UtilisateurDto>> Inscrire([FromBody] InscriptionDto dto)
        {
            var utilisateur = await _authService.Inscrire(dto);
            return CreatedAtAction(nameof(GetUtilisateurCourant), utilisateur);
        }

        [HttpPost("connexion")]
        public async Task<ActionResult<UtilisateurDto>> Connecter([FromBody] ConnexionDto dto)
        {
            var utilisateur = await _authService.Connecter(dto);
            return Ok(utilisateur);
        }

        [HttpPost("deconnexion")]
        public async Task<ActionResult> Deconnecter()
        {
            await _authService.Deconnecter();
            return NoContent();
        }

        [Authorize]
        [HttpGet("moi")]
        public async Task<ActionResult<UtilisateurDto>> GetUtilisateurCourant()
        {
            int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var utilisateur = await _authService.GetUtilisateurCourant(id);

            return Ok(utilisateur);
        }
    }
}
