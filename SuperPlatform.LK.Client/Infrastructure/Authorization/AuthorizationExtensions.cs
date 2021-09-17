using Microsoft.AspNetCore.Builder;

namespace SuperPlatform.LK.Client.Infrastructure.Authorization
{
    public static class AuthorizationExtensions
    {
        public static IApplicationBuilder UseCustomAuthorization(this IApplicationBuilder app)
        {
            return app.UseMiddleware<AuthorizationMiddleware>();
        }
    }
}
