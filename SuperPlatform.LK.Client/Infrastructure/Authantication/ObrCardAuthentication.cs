using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Infrastructure.Authantication
{
    public class ObrCardAuthentication
    {
        private HttpClient _httpClient;

        public ObrCardAuthentication(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task AuthenticateAsync(string code)
        {

        }
    }
}
