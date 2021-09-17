using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public interface ISectionGroupChildrenService : IBaseCrudService<SectionGroupChildren>
    {
        Task<IReadOnlyList<SectionGroupChildren>> GetByChild(long childId);

        Task<IReadOnlyList<SectionGroupChildren>> GetBySectionGroups(long[] sectionGroupIds);
    }
}
