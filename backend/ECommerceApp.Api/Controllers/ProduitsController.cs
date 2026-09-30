using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduitsController : ControllerBase
    {
        private readonly IProduitService _produitService;

        public ProduitsController(IProduitService produitService)
        {
            _produitService = produitService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProduitDto>>> GetAll()
        {
            var dtos = await _produitService.GetAll();
            return Ok(dtos);
        }
    }
}
