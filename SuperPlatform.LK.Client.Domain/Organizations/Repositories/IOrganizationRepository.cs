using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Organizations.Repositories
{
    public interface IOrganizationRepository
    {
        Task<PagedList<Organization>> GetAll(int? skip, int? take, long? cityId, long? directionId);

        Task<Organization> GetById(long id);

        Task<IReadOnlyList<Organization>> Suggestion(string query);
    }
}