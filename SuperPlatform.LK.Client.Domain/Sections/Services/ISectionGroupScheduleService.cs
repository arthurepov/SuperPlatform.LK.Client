using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public interface ISectionGroupScheduleService : IBaseCrudService<SectionGroupSchedule>
    {
        Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroup(long sectionGroupId);

        Task<IReadOnlyList<SectionGroupSchedule>> GetBySectionGroups(long[] sectionGroupIds);
    }
}
