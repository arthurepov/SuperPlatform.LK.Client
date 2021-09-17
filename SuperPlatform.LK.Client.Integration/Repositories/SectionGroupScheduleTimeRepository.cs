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
    public class SectionGroupScheduleTimeRepository : BaseCrudRepository<SectionGroupScheduleTime>, ISectionGroupScheduleTimeRepository
    {
        public SectionGroupScheduleTimeRepository(
          IHttpClientFactory clientFactory,
          StrapiClientSettings strapiClientSettings,
          ILogger<SectionGroupScheduleTimeRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<SectionGroupScheduleTime>> GetBySectionGroupSchedules(long[] sectionGroupScheduleIds)
        {
            if (sectionGroupScheduleIds.Count() == 0)
            {
                return new List<SectionGroupScheduleTime>(0);
            }

            var queryString = string.Join("&", sectionGroupScheduleIds.Select(x => $"SectionGroupSchedule_in={x}"));

            return await SendGetRequest<List<SectionGroupScheduleTime>>($"{GetContentUrl()}?{queryString}");
        }
    }
}
