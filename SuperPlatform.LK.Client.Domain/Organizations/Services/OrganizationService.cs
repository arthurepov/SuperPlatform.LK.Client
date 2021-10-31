using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using SuperPlatform.LK.Client.Domain.Organizations.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Organizations.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly IOrganizationRepository _organizationRepository;

        public OrganizationService(IOrganizationRepository organizationRepository) 
        {
            _organizationRepository = organizationRepository;
        }

        public async Task<PagedList<Organization>> GetAll(int? skip, int? take, long? cityId, long? directionId)
        {
            return await _organizationRepository.GetAll(skip, take, cityId, directionId);
        }

        public async Task<IReadOnlyList<Organization>> Suggestion(string query)
        {
            return await _organizationRepository.Suggestion(query);
        }

        public async Task<Organization> GetById(long id)
        {
            return await _organizationRepository.GetById(id);
        }
    }
}
