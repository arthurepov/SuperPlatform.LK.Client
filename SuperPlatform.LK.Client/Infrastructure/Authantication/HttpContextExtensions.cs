using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public static class HttpContextExtensions
    { 
        public static async Task AuthenticateAsync(this HttpContext context)
        {
            if (context.Request.Query.TryGetValue("Code", out var code))
            {
              //  await context.RequestServices.GetRequiredService<ObrCardAuthenticationHandler>().ChallengeAsync(code);
            }
        }
    }
}
