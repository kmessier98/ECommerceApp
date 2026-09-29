using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategorieService _categorieService;

        public CategoriesController(ICategorieService categorieService)
        {
            _categorieService = categorieService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategorieDto>>> GetAll()
        {
            var dtos = await _categorieService.GetAll();
            return Ok(dtos);
        }
    }
}
