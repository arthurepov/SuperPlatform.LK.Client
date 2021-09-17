using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Children.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class StrapiChildRepository : BaseCrudRepository<StrapiChild>, IStrapiChildRepository
    {
        public StrapiChildRepository(
         IHttpClientFactory clientFactory,
         StrapiClientSettings strapiClientSettings,
         ILogger<StrapiChildRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<StrapiChild>> GetByPhone(string phone)
        {
            return await SendGetRequest<List<StrapiChild>>($"{GetContentUrl()}?Phone={phone}");
        }

        public async Task<StrapiChild> GetByEducationCardId(string educationCardId)
        {
            return await SendGetRequest<StrapiChild>($"{GetContentUrl()}?EducationCardChildId={educationCardId}");
        }
    }
}
