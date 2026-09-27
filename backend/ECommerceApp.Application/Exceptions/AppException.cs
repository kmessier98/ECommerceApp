namespace ECommerceApp.Application.Exceptions
{
    public abstract class AppException : Exception
    {
        protected AppException(string message) : base(message) { }
    }

    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(message) { }
        public NotFoundException(string entityName, object key)
            : base($"{entityName} avec l'id '{key}' n'a pas été trouvé.") { }
    }

    public class BusinessRuleException : AppException
    {
        public BusinessRuleException(string message) : base(message) { }
    }

    public class ConflictException : AppException
    {
        public ConflictException(string message) : base(message) { }
    }

    public class UnauthorizedAppException : AppException
    {
        public UnauthorizedAppException(string message) : base(message) { }
    }
}
