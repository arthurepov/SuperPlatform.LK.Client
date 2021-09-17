using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionGroupScheduleTimeService : BaseCrudService<SectionGroupScheduleTime>, ISectionGroupScheduleTimeService
    {
        public SectionGroupScheduleTimeService(ISectionGroupScheduleTimeRepository repository) : base(repository) { }

        public async Task<IReadOnlyList<SectionGroupScheduleTime>> GetBySectionGroupSchedules(long[] sectionGroupScheduleIds)
        {
            return await ((ISectionGroupScheduleTimeRepository)Repository).GetBySectionGroupSchedules(sectionGroupScheduleIds);
        }
    }
}
