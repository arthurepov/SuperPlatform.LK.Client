using Newtonsoft.Json;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public static class ConverterFactory<T> where T : IEntity
    {
        public static JsonConverter Create()
        {
            if (typeof(T) == typeof(Organization))
            {
                return new OrganizationConverter();
            }
            else
            {
                return new CreateUpdateJsonConverter();
            }
        }
    }
}
