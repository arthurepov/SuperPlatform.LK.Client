using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Children.Repositories;
using SuperPlatform.LK.Client.Integration.Exceptions;
using SuperPlatform.LK.Client.Integration.Models;
using SuperPlatform.LK.Client.Integration.Settings;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class ChildRepository : IChildRepository
    {
        private readonly IHttpClientFactory _clientFactory;

        protected readonly ObrCardClientSettings _obrCardSettings;

        protected readonly ILogger<ChildRepository> _logger;

        public ChildRepository(IHttpClientFactory httpClientFactory, ObrCardClientSettings obrCardSettings, ILogger<ChildRepository> logger)
        {
            _clientFactory = httpClientFactory;
            _obrCardSettings = obrCardSettings;
            _logger = logger;
        }

        public async Task<IReadOnlyList<Child>> GetByToken(string token)
        {
            var client = GetClient(token);

            var response = await client.GetAsync("/api/v2/oauth/profile/children");

            var contetnt = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                ThrowException($"Ошибка получения информации о детях {contetnt}");
            }

            var obrCardResponse = JsonConvert.DeserializeObject<ObrCardResponse<ChildrenResponse>>(contetnt);
            if (!obrCardResponse.Success)
            {
                ThrowException($"Ошибка получения информации о детях {obrCardResponse.Message}");
            }

            return obrCardResponse.Data.Children;
        }

        private HttpClient GetClient(string token)
        {
            var client = _clientFactory.CreateClient(_obrCardSettings.ClientName);

            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            return client;
        }

        private void ThrowException(string message)
        {
            _logger.LogError(message);

            throw new IntegrationException(message);
        }
    }
}