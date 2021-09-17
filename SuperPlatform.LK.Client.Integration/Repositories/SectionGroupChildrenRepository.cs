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
    public class SectionGroupChildrenRepository : BaseCrudRepository<SectionGroupChildren>, ISectionGroupChildrenRepository
    {
        public SectionGroupChildrenRepository(
            IHttpClientFactory clientFactory,
            StrapiClientSettings strapiClientSettings,
            ILogger<SectionGroupChildrenRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<SectionGroupChildren>> GetByChild(long childId)
        {
            return await SendGetRequest<List<SectionGroupChildren>>($"{GetContentUrl()}?Child={childId}");
        }

        public async Task<IReadOnlyList<SectionGroupChildren>> GetBySectionGroups(long[] sectionGroupIds)
        {
            if (sectionGroupIds.Count() == 0)
            {
                return new List<SectionGroupChildren>(0);
            }

            var queryString = string.Join("&", sectionGroupIds.Select(x => $"SectionGroup_in={x}"));

            return await SendGetRequest<List<SectionGroupChildren>>($"{GetContentUrl()}?{queryString}");
        }
    }
}