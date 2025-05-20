using BitBalance.API.Filters;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;

namespace BitBalance.API.Extensions;

public static class APIServiceExtensions
{
    public static IServiceCollection AddAPIService(this IServiceCollection services)
    {
        services.AddSwaggerDocumentation();
        services.AddScoped<RequestLoggingFilter>();

        return services;
    }

    public static IApplicationBuilder UseAPIService(this IApplicationBuilder app)
    {
        app.UseSwaggerDocumentation();

        return app;
    }
}


public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Get UserId as string
    /// </summary>
    public static string GetUserId(this ClaimsPrincipal principal)
    {
        if (principal == null)
            throw new ArgumentNullException(nameof(principal));
        return "b4c5701b-ba0d-4619-9e8f-2e48292733b3";
        return principal.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? throw new InvalidOperationException("User ID claim not found");
    }
    /// <summary>
    /// Get UserId as Guid
    /// </summary>
    public static Guid GetUserIdAsGuid(this ClaimsPrincipal principal)
    {
        var userIdString = principal.GetUserId();

        if (!Guid.TryParse(userIdString, out Guid userId))
            throw new InvalidOperationException("User ID is not a valid GUID");

        return userId;
    }
}
public static class HttpContextExtensions
{
    /// <summary>
    /// Get UserId from HttpContext
    /// </summary>
    public static string GetCurrentUserId(this IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor?.HttpContext?.User == null)
            throw new InvalidOperationException("User is not authenticated");

        return httpContextAccessor.HttpContext.User.GetUserId();
    }
}