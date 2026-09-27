using AutoMapper;
using FluentValidation;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Services
{
    public class TestService : ITestService
    {
        private readonly IValidator<CreateTestDto> _createValidator;
        private readonly IValidator<UpdateTestDto> _updateValidator;
        private readonly IMapper _mapper;
        private readonly ITestRepository _repository;

        public TestService(
            IValidator<CreateTestDto> createValidator,
            IValidator<UpdateTestDto> updateValidator,
            IMapper mapper,
            ITestRepository repository)
        {
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<TestDto> Create(CreateTestDto dto)
        {
            var result = await _createValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            if (await _repository.ExistsByNomAsync(dto.Nom))
                throw new ConflictException("Ce nom est déjà utilisé.");

            var entity = _mapper.Map<Test>(dto);
            await _repository.CreateAsync(entity); // entity.Id rempli après cet appel

            return _mapper.Map<TestDto>(entity);
        }

        public async Task<TestDto> Update(int id, UpdateTestDto dto)
        {
            var result = await _updateValidator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            var entity = await _repository.FindByIdAsync(id);
            if (entity is null)
                throw new NotFoundException(nameof(Test), id);

            if (await _repository.ExistsByNomAsync(dto.Nom, excludeId: id))
                throw new ConflictException("Ce nom est déjà utilisé.");

            _mapper.Map(dto, entity);
            await _repository.UpdateAsync(entity);

            return _mapper.Map<TestDto>(entity);
        }

        public async Task Delete(int id)
        {
            var entity = await _repository.FindByIdAsync(id);
            if (entity is null)
                throw new NotFoundException(nameof(Test), id);

            await _repository.DeleteAsync(entity);
        }

        public async Task<TestDto> Get(int id)
        {
            var entity = await _repository.FindByIdAsync(id);
            if (entity is null)
                throw new NotFoundException(nameof(Test), id);

            return _mapper.Map<TestDto>(entity);
        }

        public async Task<List<TestDto>> GetAll()
        {
            var entities = await _repository.GetAllAsync();

            return _mapper.Map<List<TestDto>>(entities);
        }
    }
}
