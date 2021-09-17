using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public class OrganizationConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            JToken t = new JObject();

            var properties = value.GetType().GetProperties();
            foreach (var property in properties)
            {
                var propName = property.Name.ToLower();
                var isEntity = property.PropertyType.GetInterfaces().Any(y => y == typeof(IEntity));
                var isEnum = property.PropertyType.IsEnum
                    || (Nullable.GetUnderlyingType(property.PropertyType) != null && Nullable.GetUnderlyingType(property.PropertyType).IsEnum);

                if (isEntity)
                {
                    var entity = (IEntity)value.GetType().GetProperty(property.Name).GetValue(value, null);
                    t[propName] = entity?.Id;
                }
                else if (isEnum)
                {
                    var prop = value.GetType().GetProperty(property.Name).GetValue(value, null);
                    t[propName] = prop?.ToString();
                }
                else
                {
                    t[propName] = value.GetType().GetProperty(nameof(property.Name)).GetValue(value, null).ToString();
                }
            }

            t.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException("Unnecessary because CanRead is false. The type will skip the converter.");
        }

        public override bool CanRead
        {
            get { return false; }
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType.GetInterfaces().Any(x => x == typeof(Domain.Organizations.Models.Organization));
        }
    }
}
