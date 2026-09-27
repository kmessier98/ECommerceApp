using ECommerceApp.Application.Interfaces;
using ECommerceApp.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly ITestService _service;

        public TestsController(ITestService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestDto>> Get(int id)
        {
            var dto = await _service.Get(id);
            return Ok(dto);
        }

        [HttpGet]
        public async Task<ActionResult<List<TestDto>>> GetAll()
        {
            var dtos = await _service.GetAll();
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<TestDto>> Create(CreateTestDto dto)
        {
            var result = await _service.Create(dto);

            return CreatedAtAction(
                nameof(Get),
                new { id = result.Id },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TestDto>> Update(int id, UpdateTestDto dto)
        {
            var result = await _service.Update(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return NoContent();
        }
    }
}
