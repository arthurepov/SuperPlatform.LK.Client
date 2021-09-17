using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authorization
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.User.Identity.IsAuthenticated)
                await context.ChallengeAsync("oidc");
            else
                await _next(context);
        }
    }
}