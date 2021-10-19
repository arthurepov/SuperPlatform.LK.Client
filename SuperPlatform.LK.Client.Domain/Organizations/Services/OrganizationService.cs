using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using SuperPlatform.LK.Client.Domain.Organizations.Repositories;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Organizations.Services
{
    public class OrganizationService : BaseCrudService<Organization>, IOrganizationService
    {
        public OrganizationService(IOrganizationRepository organizationRepository) : base(organizationRepository) { }

        public async Task<PagedList<Organization>> GetAll(int? skip, int? take, long? cityId, long? directionId)
        {
            return await ((IOrganizationRepository)Repository).GetAll(skip, take, cityId, directionId);
        }
    }
}
