using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using SuperPlatform.LK.Client.Domain.Disciplines.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Disciplines.Services
{
    public class DisciplineService : BaseCrudService<Discipline>, IDisciplineService
    {
        public DisciplineService(IDisciplineRepository disciplineRepository) : base(disciplineRepository) { }

        public async Task<PagedList<Discipline>> GetAll(int? skip, int? take, long? cityId, long? directionId)
        {
            return await ((IDisciplineRepository)Repository).GetAll(skip, take, cityId, directionId);
        }

        public async Task<List<Discipline>> Suggestion(string query)
        {
            return await ((IDisciplineRepository)Repository).Suggestion(query);
        }
    }
}
