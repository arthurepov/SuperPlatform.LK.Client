using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionGroupService : BaseCrudService<SectionGroup>, ISectionGroupService
    {
        public SectionGroupService(ISectionGroupRepository repository) : base(repository) { }

        public async Task<IReadOnlyList<SectionGroup>> GetBySections(long[] sectionIds)
        {
            return await ((ISectionGroupRepository)Repository).GetBySections(sectionIds);
        }
    }
}
