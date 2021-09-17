using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;

namespace SuperPlatform.LK.Client.Domain.Sections.Services
{
    public class SectionService : BaseCrudService<Section>, ISectionService
    {
        public SectionService(ISectionRepository sectionRepository) : base(sectionRepository) { }

        public async Task<PagedList<Section>> GetByDirection(long directionId, int? skip, int? take)
        {
            return await((ISectionRepository)Repository).GetByDirection(directionId, skip, take);
        }
    }
}