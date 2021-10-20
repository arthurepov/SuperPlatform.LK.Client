using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using SuperPlatform.LK.Client.Domain.Organizations.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class OrganizationRepository : BaseCrudRepository<Organization>, IOrganizationRepository
    {
        public OrganizationRepository(
         IHttpClientFactory clientFactory,
         StrapiClientSettings strapiClientSettings,
         ILogger<OrganizationRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<PagedList<Organization>> GetAll(int? skip, int? take, long? cityId, long? directionId)
        {
            var queryString = GetPagingQueryParams(skip, take);
            if (cityId.HasValue)
            {
                queryString.Add("Sections.Organization.city", cityId.Value.ToString());
            }

            if (directionId.HasValue)
            {
                queryString.Add("Sections.Discipline.direction", directionId.Value.ToString());
            }

            var entities = await SendGetRequest<List<Organization>>($"{GetContentUrl()}?{queryString}");

            var totalCount = await GetTotalCount(queryString);

            return new PagedList<Organization>(entities, totalCount);
        }

        public async Task<List<Organization>> Suggestion(string query)
        {
            var queryString = $"name_contains={query}";

            var entities = await SendGetRequest<List<Organization>>($"{GetContentUrl()}?{queryString}");

            return entities;
        }
    }
}
