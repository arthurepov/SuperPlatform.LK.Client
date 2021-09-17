using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public class CreateUpdateJsonConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            JToken t = JToken.FromObject(value);
            if (value is IEntity)
            {
                var propNames = GetEntityProperties(value);
                var enumProperties = GetEnumProperties(value);

                foreach (var propName in propNames)
                {
                    var entity = (IEntity)value.GetType().GetProperty(propName).GetValue(value, null);
                    t[propName] = entity?.Id;
                }

                foreach (var propName in enumProperties)
                {
                    var prop = value.GetType().GetProperty(propName).GetValue(value, null);
                    t[propName] = prop?.ToString();
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
            return objectType.GetInterfaces().Any(x => x == typeof(IEntity));
        }

        private string[] GetEntityProperties(object value)
        {
            var properties = value.GetType().GetProperties().Where(x => x.PropertyType.GetInterfaces().Any(y => y == typeof(IEntity)));

            var propNames = properties.Select(x => x.Name).ToArray();

            return propNames;
        }

        private string[] GetEnumProperties(object value)
        {
            var properties = value
                .GetType()
                .GetProperties()
                .Where(x => x.PropertyType.IsEnum ||
                    (Nullable.GetUnderlyingType(x.PropertyType) != null && Nullable.GetUnderlyingType(x.PropertyType).IsEnum));

            var propNames = properties.Select(x => x.Name).ToArray();

            return propNames;
        }
    }
}
