using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class SectionGroupRepository : BaseCrudRepository<SectionGroup>, ISectionGroupRepository
    {
        public SectionGroupRepository(
           IHttpClientFactory clientFactory,
           StrapiClientSettings strapiClientSettings,
           ILogger<SectionGroupRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<SectionGroup>> GetBySections(long[] sectionIds)
        {
            if(sectionIds.Count() == 0)
            {
                return new List<SectionGroup>(0);
            }

            var queryString = string.Join("&", sectionIds.Select(x => $"Section_in={x}"));

            return await SendGetRequest<List<SectionGroup>>($"{GetContentUrl()}?{queryString}");
        }
    }
}