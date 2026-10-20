using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaiementsController : ControllerBase
    {
        private readonly IPaiementService _paiementService;
        private readonly ICommandeService _commandeService;

        public PaiementsController(IPaiementService paiementService, ICommandeService commandeService)
        {
            _paiementService = paiementService;
            _commandeService = commandeService;
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            // Le texte EXACT reçu : la signature est calculée sur lui.
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            var signature = Request.Headers["Stripe-Signature"].ToString();

            var sessionId = _paiementService.LireSessionPayee(json, signature);

            if (sessionId != null)
                await _commandeService.ConfirmerPaiement(sessionId);

            return Ok();
        }
    }
}
