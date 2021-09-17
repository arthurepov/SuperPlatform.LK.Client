using Microsoft.AspNetCore.Authentication;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthenticationOptions : RemoteAuthenticationOptions
    {
        public string BaseUrl { get; set; }

        public string Secret { get; set; }

        public string ClientId { get; set; }

        public string RedirectUrl { get; set; }

        public ISecureDataFormat<AuthenticationProperties> StateDataFormat { get; set; }
    }
}
