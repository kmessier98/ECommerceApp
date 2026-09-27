using FluentValidation;
using ECommerceApp.Application.Exceptions;

namespace ECommerceApp.Api.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex) //FluentValidation errors
            {
                await WriteErrorsAsync(context, StatusCodes.Status400BadRequest, ex.Errors.Select(e => e.ErrorMessage));
            }
            catch (NotFoundException ex)
            {
                await WriteErrorsAsync(context, StatusCodes.Status404NotFound, [ex.Message]);
            }
            catch (ConflictException ex)
            {
                await WriteErrorsAsync(context, StatusCodes.Status409Conflict, [ex.Message]);
            }
            catch (BusinessRuleException ex)
            {
                await WriteErrorsAsync(context, StatusCodes.Status400BadRequest, [ex.Message]);
            }
            catch (UnauthorizedAppException ex)
            {
                await WriteErrorsAsync(context, StatusCodes.Status401Unauthorized, [ex.Message]);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception non gérée pendant le traitement de {Method} {Path}.", context.Request.Method, context.Request.Path);
                await WriteErrorsAsync(context, StatusCodes.Status500InternalServerError, ["Une erreur interne est survenue."]);
            }
        }

        // Forme d'erreur unique { "errors": [...] }, lue côté client par ApiErrorResponse.
        private static async Task WriteErrorsAsync(HttpContext context, int statusCode, IEnumerable<string> errors)
        {
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(new { errors });
        }
    }
}
