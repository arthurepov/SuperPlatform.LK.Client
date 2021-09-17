using Newtonsoft.Json.Serialization;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public class OrganizationContractResolver : DefaultContractResolver
    {
        protected override string ResolvePropertyName(string propertyName)
        {
            return propertyName.ToLower();
        }
    }
}