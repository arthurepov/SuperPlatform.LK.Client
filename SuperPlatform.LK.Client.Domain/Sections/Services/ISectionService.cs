using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public interface ISectionService : IBaseCrudService<Section>
    {
        Task<PagedList<Section>> GetByDirection(long directionId, int? skip, int? take);
    }
}
