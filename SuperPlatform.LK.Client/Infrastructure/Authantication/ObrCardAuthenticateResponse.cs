using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthenticateResponse
    {
        [JsonProperty("success")]
        public bool IsSuccess { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("errors")]
        public string Error { get; set; }

        [JsonProperty("data")]
        public ObrCardAuthenticateToken Token { get; set; }
    }
}
