using Newtonsoft.Json.Serialization;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Models;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public static class ContractResolverFactory<T> where T : IEntity
    {
        public static IContractResolver Create()
        {
            if (typeof(T) == typeof(Organization))
            {
                return new OrganizationContractResolver();
            }
            else
            {
                return new DefaultContractResolver();
            }
        }
    }
}
