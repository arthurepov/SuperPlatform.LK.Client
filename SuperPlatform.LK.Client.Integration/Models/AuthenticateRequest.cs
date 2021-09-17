using Newtonsoft.Json;

namespace SuperPlatform.LK.Client.Integration.Models
{
    public class AuthenticateRequest
    {
        [JsonProperty("identifier")]
        public string Identifier { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
