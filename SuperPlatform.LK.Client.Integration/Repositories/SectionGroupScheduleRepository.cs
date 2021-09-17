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
    public class SectionGroupScheduleRepository : BaseCrudRepository<SectionGroupSchedule>, ISectionGroupScheduleRepository
    {
        public SectionGroupScheduleRepository(
            IHttpClientFactory clientFactory,
            StrapiClientSettings strapiClientSettings,
            ILogger<SectionGroupScheduleRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroup(long sectionGroupId)
        {
            return await SendGetRequest<List<SectionGroupSchedule>>($"{GetContentUrl()}?SectionGroup={sectionGroupId}");
        }

        public async Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroups(long[] sectionGroupIds)
        {
            if (sectionGroupIds.Count() == 0)
            {
                return new List<SectionGroupSchedule>(0);
            }

            var queryString = string.Join("&", sectionGroupIds.Select(x => $"SectionGroup_in={x}"));

            return await SendGetRequest<List<SectionGroupSchedule>>($"{GetContentUrl()}?{queryString}");
        }
    }
}
