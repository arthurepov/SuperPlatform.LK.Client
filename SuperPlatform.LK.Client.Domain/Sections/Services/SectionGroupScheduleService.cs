using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionGroupScheduleService : BaseCrudService<SectionGroupSchedule>, ISectionGroupScheduleService
    {
        public SectionGroupScheduleService(ISectionGroupScheduleRepository repository) : base(repository) { }

        public async Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroup(long sectionGroupId)
        {
            return await ((ISectionGroupScheduleRepository)Repository).GetBySectionGroup(sectionGroupId);
        }

        public async Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroups(long[] sectionGroupIds)
        {
            return await ((ISectionGroupScheduleRepository)Repository).GetBySectionGroups(sectionGroupIds);
        }
    }
}
