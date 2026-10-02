using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanierController : ControllerBase
    {
        private readonly IPanierService _panierService;

        public PanierController(IPanierService panierService)
        {
            _panierService = panierService;
        }

        [HttpGet]
        public async Task<ActionResult<PanierDto>> Get()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claim, out var userId))
                return Unauthorized(); //TODO permettre plus tard

            var panier = await _panierService.Get(userId);
            return Ok(panier);
        }

        [HttpPost("articles")]
        public async Task<ActionResult> AjouterArticle([FromBody] AjouterArticlePanierDto dto)
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claim, out var userId))
                return Unauthorized(); //TODO permettre plus tard

            await _panierService.AjouterArticle(userId, dto);
            return NoContent();
        }

        [HttpPatch("articles/{produitId:int}")]
        public async Task<ActionResult> ModifierArticle([FromRoute] int produitId, [FromBody] ModifierArticlePanierDto dto)
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claim, out var userId))
                return Unauthorized(); //TODO permettre plus tard

            await _panierService.ModifierArticle(userId, produitId, dto);
            return NoContent();
        }

        [HttpDelete("articles/{produitId:int}")]
        public async Task<ActionResult> RetirerArticle([FromRoute] int produitId)
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claim, out var userId))
                return Unauthorized(); //TODO permettre plus tard

            await _panierService.RetirerArticle(userId, produitId);
            return NoContent();
        }
    }
}
