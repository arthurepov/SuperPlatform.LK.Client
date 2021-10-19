using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using SuperPlatform.LK.Client.Domain.Directions.Repositories;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Directions.Services
{
    public class DirectionService : BaseCrudService<Direction>, IDirectionService
    {
        public DirectionService(IDirectionRepository directionRepository) : base(directionRepository) { }

        public async Task<PagedList<Direction>> GetAll(int? skip, int? take, long? cityId)
        {
            return await ((IDirectionRepository)Repository).GetAll(skip, take, cityId);
        }
    }
}
