using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Repositories
{
    public interface ISectionGroupScheduleTimeRepository : IBaseCrudRepository<SectionGroupScheduleTime>
    {
        Task<IReadOnlyList<SectionGroupScheduleTime>> GetBySectionGroupSchedules(long[] sectionGroupScheduleIds);
    }
}
