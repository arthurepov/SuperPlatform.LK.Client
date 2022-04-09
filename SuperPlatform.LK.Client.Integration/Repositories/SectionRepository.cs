using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class SectionRepository : BaseCrudRepository<Section>, ISectionRepository
    {
        public SectionRepository(
          IHttpClientFactory clientFactory,
          StrapiClientSettings strapiClientSettings,
          ILogger<SectionRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<IReadOnlyList<Section>> GetByOrganization(long organizationId)
        {
            var queryString = $"Organization={organizationId}";

            var entities = await SendGetRequest<List<Section>>($"{GetContentUrl()}?{queryString}");

            return entities;
        }

        public async Task<PagedList<Section>> GetByDirection(long directionId, int? skip, int? take)
        {
            var queryString = GetPagingQueryParams(skip, take);

            queryString.Add($"{nameof(Section.Discipline)}.{nameof(Section.Direction).ToLower()}", directionId.ToString());

            var entities = await SendGetRequest<List<Section>>($"{GetContentUrl()}?{queryString}");
            var totalCount = await GetTotalCount(queryString);

            return new PagedList<Section>(entities, totalCount);
        }

        public async Task<IReadOnlyList<Section>> Suggestion(string query)
        {
            var queryString = $"_where[_or][0][Name_contains]={query}&[_or][1][Organization.name_contains]={query}";

            var entities = await SendGetRequest<List<Section>>($"{GetContentUrl()}?{queryString}");

            return entities;
        }
    }
}
