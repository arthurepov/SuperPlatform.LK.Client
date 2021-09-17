using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionGroupChildrenService : BaseCrudService<SectionGroupChildren>, ISectionGroupChildrenService
    {
        public SectionGroupChildrenService(ISectionGroupChildrenRepository repository) : base(repository) { }

        public async Task<IReadOnlyList<SectionGroupChildren>> GetByChild(long childId)
        {
            return await ((ISectionGroupChildrenRepository)Repository).GetByChild(childId);
        }

        public async Task<IReadOnlyList<SectionGroupChildren>> GetBySectionGroups(long[] sectionGroupIds)
        {
            return await ((ISectionGroupChildrenRepository)Repository).GetBySectionGroups(sectionGroupIds);
        }
    }
}