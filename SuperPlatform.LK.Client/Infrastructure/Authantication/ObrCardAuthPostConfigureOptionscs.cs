using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthPostConfigureOptionscs<TOptions, THandler> : IPostConfigureOptions<TOptions>
        where TOptions : ObrCardAuthenticationOptions, new()
        where THandler : ObrCardAuthenticationHandler
    {
        private readonly IDataProtectionProvider _dp;

        public ObrCardAuthPostConfigureOptionscs(IDataProtectionProvider dataProtection)
        {
            _dp = dataProtection;
        }

        public void PostConfigure(string name, TOptions options)
        {
            options.DataProtectionProvider = options.DataProtectionProvider ?? _dp;
            if (options.Backchannel == null)
            {
                options.Backchannel = new HttpClient(options.BackchannelHttpHandler ?? new HttpClientHandler());
                options.Backchannel.DefaultRequestHeaders.UserAgent.ParseAdd("Microsoft ASP.NET Core ObrCardAuth handler");
                options.Backchannel.Timeout = options.BackchannelTimeout;
                options.Backchannel.MaxResponseContentBufferSize = 1024 * 1024 * 10; // 10 MB
            }
        }
    }
}