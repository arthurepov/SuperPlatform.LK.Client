using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using SuperPlatform.LK.Client.Domain.Directions.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class DirectionRepository : BaseCrudRepository<Direction>, IDirectionRepository
    {
        public DirectionRepository(
            IHttpClientFactory clientFactory,
            StrapiClientSettings strapiClientSettings,
            ILogger<DirectionRepository> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public async Task<PagedList<Direction>> GetAll(int? skip, int? take, long? cityId)
        {
            var queryString = GetPagingQueryParams(skip, take);
            if (cityId.HasValue)
            {
                queryString.Add("disciplines.Sections.Organization.city", cityId.Value.ToString());
            }

            var entities = await SendGetRequest<List<Direction>>($"{GetContentUrl()}?{queryString}");

            var totalCount = await GetTotalCount(queryString);

            return new PagedList<Direction>(entities, totalCount);
        }
    }
}
