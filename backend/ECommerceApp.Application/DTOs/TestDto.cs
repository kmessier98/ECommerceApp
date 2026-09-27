namespace ECommerceApp.Application.DTOs
{
    public class TestDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
    }

    public class CreateTestDto
    {
        public string Nom { get; set; } = string.Empty;
    }

    public class UpdateTestDto
    {
        public string Nom { get; set; } = string.Empty;
    }
}
