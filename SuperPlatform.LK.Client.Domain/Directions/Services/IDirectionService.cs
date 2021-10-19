using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Directions.Services
{
    public interface IDirectionService : IBaseCrudService<Direction>
    {
        Task<PagedList<Direction>> GetAll(int? skip, int? take, long? cityId);
    }
}
