using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Organizations.Services
{
    public interface IOrganizationService : IBaseCrudService<Organization>
    {
        Task<PagedList<Organization>> GetAll(int? skip, int? take, long? cityId, long? directionId);

        Task<IReadOnlyList<Organization>> Suggestion(string query);
    }
}
