using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SuperPlatform.LK.Client.Integration.Exceptions;
using SuperPlatform.LK.Client.Integration.Models;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Abstractions
{
    public abstract class HttpRepository
    {
        private readonly IHttpClientFactory _clientFactory;

        protected readonly StrapiClientSettings _strapiClientSettings;

        protected readonly ILogger<HttpRepository> Logger;

        public HttpRepository(
            IHttpClientFactory clientFactory,
            StrapiClientSettings strapiClientSettings,
            ILogger<HttpRepository> logger)
        {
            _clientFactory = clientFactory;
            _strapiClientSettings = strapiClientSettings;
            Logger = logger;
        }

        protected async Task<TResponse> SendGetRequest<TResponse>(string url)
            where TResponse : class
        {
            var response = await SendGetRequest(url);
            var jsonResponse = await response.Content.ReadAsStringAsync();
            var result = DeserializeObject<TResponse>(jsonResponse);

            return result;
        }

        protected async Task<HttpResponseMessage> SendGetRequest(string url)
        {
            var client = await GetClient();
            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                Logger.LogError($"Ошибка интеграции со страпи. Код ответа: {response.StatusCode}. Сообщение: {content}");
                throw new IntegrationException("Произошла ошибка получения данных из strapi");
            }

            return response;
        }

        protected async Task<HttpResponseMessage> SendRequest(string url, HttpMethod httpMethod)
        {
            var httpRequestMessage = new HttpRequestMessage
            {
                Method = httpMethod,
                RequestUri = new System.Uri(url, UriKind.Relative)
            };

            return await SendRequest(url, httpRequestMessage);
        }

        protected async Task<HttpResponseMessage> SendPostRequest<TRequest>(string url, TRequest request)
            where TRequest : class
        {
            return await SendRequest(url, request, HttpMethod.Post);
        }

        protected async Task<TResponse> SendPostRequest<TResponse, TRequest>(string url, TRequest request)
            where TRequest : class
            where TResponse : class
        {
            return await SendRequest<TResponse, TRequest>(url, request, HttpMethod.Post);
        }

        protected async Task<HttpResponseMessage> SendPutRequest<TRequest>(string url, TRequest request)
            where TRequest : class
        {
            return await SendRequest(url, request, HttpMethod.Put);
        }

        private async Task<TResponse> SendRequest<TResponse, TRequest>(string url, TRequest request, HttpMethod httpMethod)
            where TRequest : class
            where TResponse : class
        {
            var response = await SendRequest(url, request, httpMethod);
            var content = await response.Content.ReadAsStringAsync();

            return DeserializeObject<TResponse>(content);
        }

        protected async Task<HttpResponseMessage> SendRequest<TRequest>(string url, TRequest request, HttpMethod httpMethod)
            where TRequest : class
        {
            var httpContent = new StringContent(JsonConvert.SerializeObject(request, GetSerializerSettings()), Encoding.UTF8, "application/json");
            var httpRequestMessage = new HttpRequestMessage
            {
                Content = httpContent,
                Method = httpMethod,
                RequestUri = new Uri(url, System.UriKind.Relative)
            };

            return await SendRequest(url, httpRequestMessage);
        }

        private async Task<HttpResponseMessage> SendRequest(string url, HttpRequestMessage httpRequestMessage)
        {
            var client = await GetClient();
            var response = await client.SendAsync(httpRequestMessage);
            var content = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                Logger.LogError($"Ошибка интеграции со страпи. Код ответа: {response.StatusCode}. Сообщение: {content}");
                throw new IntegrationException($"Произошла ошибка отправки данных в strapi: {content}");
            }

            return response;
        }

        protected async Task<HttpClient> GetClient()
        {
            var client = GetClientWithoutAuthorize();

            if (string.IsNullOrEmpty(_strapiClientSettings.Token) || _strapiClientSettings.Expires <= DateTime.Now)
            {
                var authResponse = await Auth(client, _strapiClientSettings.Login, _strapiClientSettings.Password);
                var token = new JwtSecurityToken(jwtEncodedString: authResponse.Jwt);

                _strapiClientSettings.Token = authResponse.Jwt;
                var dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(token.Payload.Exp.Value);
                _strapiClientSettings.Expires = dateTimeOffset.DateTime;
            }

            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_strapiClientSettings.Token}");

            return client;
        }

        protected HttpClient GetClientWithoutAuthorize()
        {
            return _clientFactory.CreateClient(_strapiClientSettings.ClientName);
        }

        protected async Task<AuthenticateResponse> Auth(HttpClient client, string login, string password)
        {
            var authRequest = new AuthenticateRequest
            {
                Identifier = login,
                Password = password
            };

            var stringPayload = JsonConvert.SerializeObject(authRequest);
            var httpContent = new StringContent(stringPayload, Encoding.UTF8, "application/json");

            var result = await client.PostAsync("auth/local", httpContent);
            var res = await result.Content.ReadAsStringAsync();

            if (!result.IsSuccessStatusCode)
            {
                Logger.LogError($"Ошибка аутентификации: {res}");
                throw new IntegrationException($"Ошибка аутентификации: {res}");
            }

            try
            {
                var obj = DeserializeObject<AuthenticateResponse>(res);

                return obj;
            }
            catch (Exception ex)
            {
                throw new IntegrationException($"Произошла ошибка при дессириализации данных {ex.Message}.");
            }
        }

        protected virtual T DeserializeObject<T>(string json) where T : class
        {
            var model = JsonConvert.DeserializeObject<T>(json, GetSerializerSettings());

            return model;
        }

        protected virtual string SerializeObject<TRequest>(TRequest request)
            where TRequest : class
        {
            return JsonConvert.SerializeObject(request, GetSerializerSettings());
        }

        protected virtual JsonSerializerSettings GetSerializerSettings()
        {
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            return settings;
        }
    }
}
