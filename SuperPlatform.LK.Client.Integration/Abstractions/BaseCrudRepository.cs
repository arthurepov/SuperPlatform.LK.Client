using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Integration.Json;
using SuperPlatform.LK.Client.Integration.Mapping;
using SuperPlatform.LK.Client.Integration.Models;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Abstractions
{
    public class BaseCrudRepository<T> : HttpRepository, IBaseCrudRepository<T>
          where T : class, IEntity
    {

        public BaseCrudRepository(
            IHttpClientFactory clientFactory,
            StrapiClientSettings strapiClientSettings,
            ILogger<BaseCrudRepository<T>> logger) : base(clientFactory, strapiClientSettings, logger)
        { }

        public virtual async Task<PagedList<T>> GetAll(int? skip, int? take)
        {
            var queryString = GetPagingQueryParams(skip, take);

            var entities = await SendGetRequest<List<T>>($"{GetContentUrl()}?{queryString}");

            var totalCount = await GetTotalCount(queryString);

            return new PagedList<T>(entities, totalCount);
        }

        public virtual async Task<T> GetById(long id)
        {
            var url = $"{GetContentUrl()}/{id}";

            return await SendGetRequest<T>(url);
        }

        public virtual async Task<IReadOnlyList<T>> GetByIds(long[] ids)
        {
            if (ids.Count() == 0)
            {
                return new List<T>();
            }

            var queryString = string.Join("&", ids.Select(x => $"Id_in={x}"));

            var url = $"{GetContentUrl()}?{queryString}";

            return await SendGetRequest<IReadOnlyList<T>>(url);
        }

        public async Task<long> Create(T entity)
        {
            var response = await SendPostRequest<CreateResponse, T>(GetContentUrl(), entity);

            return response.Id;
        }

        public async Task Update(T entity)
        {
            await SendPutRequest($"{GetContentUrl()}/{entity.Id}", entity);
        }

        public async Task Delete(long id)
        {
            var url = $"{GetContentUrl()}/{id}";

            await SendRequest(url, HttpMethod.Delete);
        }

        protected virtual async Task<int> GetTotalCount(NameValueCollection queryString)
        {
            var response = await SendGetRequest($"{GetContentCountUrl()}?{queryString}");

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

        protected string GetContentCountUrl()
        {
            return $"{GetContentUrl()}/count";
        }

        protected virtual string GetContentUrl()
        {
            return ContetntTypeUrlMapping.GetContentUrl(typeof(T));
        }

        protected override JsonSerializerSettings GetSerializerSettings()
        {
            var settings = base.GetSerializerSettings();

            settings.Converters.Add(ConverterFactory<T>.Create());

            return settings;
        }
    }
}
