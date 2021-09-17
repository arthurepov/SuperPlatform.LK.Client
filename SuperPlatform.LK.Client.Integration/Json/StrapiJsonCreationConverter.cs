using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperPlatform.LK.Client.Integration.Json
{
    public class StrapiJsonCreationConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
