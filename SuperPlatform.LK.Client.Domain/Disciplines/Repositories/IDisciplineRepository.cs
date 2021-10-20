using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Disciplines.Repositories
{
    public interface IDisciplineRepository : IBaseCrudRepository<Discipline>
    {
        Task<PagedList<Discipline>> GetAll(int? skip, int? take, long? cityId, long? directionId);

        Task<List<Discipline>> Suggestion(string query);
    }
}
