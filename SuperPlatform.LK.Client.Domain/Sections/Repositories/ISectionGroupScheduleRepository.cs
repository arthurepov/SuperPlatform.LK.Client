using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Repositories
{
    public interface ISectionGroupScheduleRepository : IBaseCrudRepository<SectionGroupSchedule>
    {
        Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroup(long sectionGroupId);

        Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroups(long[] sectionGroupIds);
    }
}
