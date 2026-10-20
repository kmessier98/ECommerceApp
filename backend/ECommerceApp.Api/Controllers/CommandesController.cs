using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommandesController : ControllerBase
    {
        private readonly ICommandeService _commandeService;

        public CommandesController(ICommandeService commandeService)
        {
            _commandeService = commandeService;
        }

        [HttpPost]
        public async Task<ActionResult<SessionPaiementDto>> PasserCommande()
        {
            var utilisateurId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var session = await _commandeService.PasserCommande(utilisateurId);
            return Ok(session);
        }
    }
}
