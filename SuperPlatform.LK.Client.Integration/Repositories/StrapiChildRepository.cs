using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
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
            var url = $"{GetContentUrl()}?EducationCardChildId={HttpUtility.UrlEncode(educationCardId)}";
            var list = await SendGetRequest<List<StrapiChild>>(url);

            return list.FirstOrDefault();
        }
    }
}
