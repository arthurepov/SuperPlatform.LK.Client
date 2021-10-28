using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Repositories
{
    public interface ISectionRepository : IBaseCrudRepository<Section>
    {
        Task<IReadOnlyList<Section>> GetByOrganization(long organizationId);

        Task<PagedList<Section>> GetByDirection(long directionId, int? skip, int? take);

        Task<IReadOnlyList<Section>> Suggestion(string query);
    }
}