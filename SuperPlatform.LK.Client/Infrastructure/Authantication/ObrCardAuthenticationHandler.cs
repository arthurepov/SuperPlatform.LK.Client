using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthenticationHandler : RemoteAuthenticationHandler<ObrCardAuthenticationOptions>
    {
        public ObrCardAuthenticationHandler(
            IOptionsMonitor<ObrCardAuthenticationOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        public override async Task<bool> ShouldHandleRequestAsync()
        {
            var token = await Context.GetTokenAsync("access_token");

            return string.IsNullOrEmpty(token);
        }

        protected override async Task<HandleRequestResult> HandleRemoteAuthenticateAsync()
        {

            var responseType = "code";
            var clientId = Options.ClientId;
            var clientSecret = Options.Secret;
            var state = "12345";
            var nonce = Guid.NewGuid().ToString("N");
            var redirectUrl = Options.RedirectUrl;
            if (Request.Query.TryGetValue("hash", out var hash))
            {
                var path = $"/api/v2/oauth/identity/authorize?" +
                    $"response_type={responseType}&client_id={clientId}&client_secret={clientSecret}&state={state}&" +
                    $"nonce={nonce}&redirect_uri={redirectUrl}&hash={hash}";

                var url = new Uri(new Uri(Options.BaseUrl), new Uri(path, UriKind.Relative));
                var response = await Options.Backchannel.GetAsync(url);
                var json = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return HandleRequestResult.Fail(new Exception(message: $"Ошибка аутентификации: {json}"));
                }
               
                var responseDesirialized = JsonConvert.DeserializeObject<ObrCardAuthenticateResponse>(json);
                if (!responseDesirialized.IsSuccess)
                {
                    return HandleRequestResult.Fail(new Exception(message: $"Ошибка аутентификации: {responseDesirialized.Error}"));
                }

                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(responseDesirialized.Token.AccessToken);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, token.Claims.First(x=>x.Type == "client_id").Value),
                    new Claim(ClaimTypes.MobilePhone, token.Claims.First(x=>x.Type == "phone").Value)
                };

                // generate claimsIdentity on the name of the class
                var claimsIdentity = new ClaimsIdentity(claims, nameof(ObrCardAuthenticationHandler));

                var authTokens = new List<AuthenticationToken>();

                authTokens.Add(new AuthenticationToken { Name = "access_token", Value = responseDesirialized.Token.AccessToken });

                var ticket = new AuthenticationTicket(
                    new ClaimsPrincipal(claimsIdentity),
                    new AuthenticationProperties { ExpiresUtc = DateTimeOffset.UtcNow.AddSeconds(responseDesirialized.Token.ExpiresIn) },
                    this.Scheme.Name);

                ticket.Properties.StoreTokens(authTokens);

                return HandleRequestResult.Success(ticket);
            }

            return HandleRequestResult.Fail(new Exception(message: "Не указан хеш пользователя"));
        }
    }
}
