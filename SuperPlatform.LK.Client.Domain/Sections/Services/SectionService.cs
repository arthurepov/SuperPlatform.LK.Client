using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionService : BaseCrudService<Section>, ISectionService
    {
        public SectionService(ISectionRepository sectionRepository) : base(sectionRepository) { }

        public async Task<IReadOnlyList<Section>> GetByOrganization(long organizationId)
        {
            return await ((ISectionRepository)Repository).GetByOrganization(organizationId);
        }

        public async Task<PagedList<Section>> GetByDirection(long directionId, int? skip, int? take)
        {
            return await((ISectionRepository)Repository).GetByDirection(directionId, skip, take);
        }

        public async Task<IReadOnlyList<Section>> Suggestion(string query)
        {
            return await ((ISectionRepository)Repository).Suggestion(query);
        }
    }
}