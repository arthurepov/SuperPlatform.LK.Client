using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using SuperPlatform.LK.Client.Domain.Disciplines.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class DisciplineRepository : BaseCrudRepository<Discipline>, IDisciplineRepository
    {
        public DisciplineRepository(
          IHttpClientFactory clientFactory,
          StrapiClientSettings strapiClientSettings,
          ILogger<DisciplineRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<PagedList<Discipline>> GetAll(int? skip, int? take, long? cityId, long? directionId)
        {
            var queryString = GetPagingQueryParams(skip, take);
            if (cityId.HasValue)
            {
                queryString.Add("Sections.Organization.city", cityId.Value.ToString());
            }

            if (directionId.HasValue)
            {
                queryString.Add("direction", directionId.Value.ToString());
            }

            var entities = await SendGetRequest<List<Discipline>>($"{GetContentUrl()}?{queryString}");

            var totalCount = await GetTotalCount(queryString);

            return new PagedList<Discipline>(entities, totalCount);
        }
    }
}
