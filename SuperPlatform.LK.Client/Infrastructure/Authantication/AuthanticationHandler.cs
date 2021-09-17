using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class AuthanticationHandler : OAuthHandler<OAuthOptions>
    {
		public AuthanticationHandler(
			IOptionsMonitor<OAuthOptions> options,
			ILoggerFactory logger,
			UrlEncoder encoder,
			ISystemClock clock)
			: base(options, logger, encoder, clock)
		{
		}

        protected override string BuildChallengeUrl(AuthenticationProperties properties, string redirectUri)
        {
            var url = base.BuildChallengeUrl(properties, redirectUri);

			return url;
        }
    }
}
