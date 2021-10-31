using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;
using SuperPlatform.LK.Client.Domain.Organizations.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Json;
using SuperPlatform.LK.Client.Integration.Models;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Repositories
{
    public class OrganizationRepository : HttpRepository, IOrganizationRepository
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

            var response = await SendGetRequest<List<OrganizationResponse>>($"organizations?{queryString}");

            var entities = response
                .Select(x => Map(x))
                .ToList();

            var totalCount = await GetTotalCount(queryString);

            return new PagedList<Organization>(entities, totalCount);
        }

        public virtual async Task<Organization> GetById(long id)
        {
            var url = $"organizations/{id}";

            var response = await SendGetRequest<OrganizationResponse>(url);

            return Map(response);
        }

        public async Task<IReadOnlyList<Organization>> Suggestion(string query)
        {
            var queryString = $"name_contains={query}";

            var response = await SendGetRequest<List<OrganizationResponse>>($"organizations?{queryString}");

            var entities = response
               .Select(x => Map(x))
               .ToList();

            return entities;
        }

        protected override JsonSerializerSettings GetSerializerSettings()
        {
            var settings = base.GetSerializerSettings();

            settings.Converters.Add(new CreateUpdateJsonConverter());

            return settings;
        }

        protected virtual async Task<int> GetTotalCount(NameValueCollection queryString)
        {
            var response = await SendGetRequest($"organizations/count?{queryString}");

            var totalCount = await response.Content.ReadAsStringAsync();

            return int.Parse(totalCount);
        }

        protected NameValueCollection GetPagingQueryParams(int? skip, int? take)
        {
            var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
            if (skip.HasValue && take.HasValue)
            {
                queryString.Add("_start", skip.Value.ToString());
                queryString.Add("_limit", take.Value.ToString());
                queryString.Add("_sort", "updated_at");
            }

            return queryString;
        }

        private Organization Map(OrganizationResponse response)
        {
            return new Organization
            {
                Id = response.Id,
                Name = response.name,
                Address = response.address,
                Longitude = response.longitude,
                Latitude = response.latitude,
                City = response.city != null ? new Domain.Cities.Models.City { Id = response.city.Id, Name = response.city.Name } : null,
                Image = response.image,
                Email = response.email,
                Phone = response.phone,
                Station = response.station
            };
        }
    }
}
