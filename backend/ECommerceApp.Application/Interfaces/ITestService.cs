using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface ITestService
    {
        Task<TestDto> Get(int id);
        Task<List<TestDto>> GetAll();
        Task<TestDto> Create(CreateTestDto dto);
        Task<TestDto> Update(int id, UpdateTestDto dto);
        Task Delete(int id);
    }
}
