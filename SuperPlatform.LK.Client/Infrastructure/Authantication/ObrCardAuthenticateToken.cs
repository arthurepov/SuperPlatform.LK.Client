using Newtonsoft.Json;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthenticateToken
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonProperty("token_type")]
        public string TokenType { get; set; }
    }
}
