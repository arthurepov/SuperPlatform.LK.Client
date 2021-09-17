using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public static class ObrCardAuthenticationExtension
    {
        public static AuthenticationBuilder AddAObrCardAuthentication(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<ObrCardAuthenticationOptions> configureOptions)
        {
            builder
                .Services
                .TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<ObrCardAuthenticationOptions>, ObrCardAuthPostConfigureOptionscs<ObrCardAuthenticationOptions, ObrCardAuthenticationHandler>>());

            return builder.AddRemoteScheme<ObrCardAuthenticationOptions, ObrCardAuthenticationHandler>(authenticationScheme, displayName, configureOptions);
        }
    }
}
