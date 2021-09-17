using System;
using SuperPlatform.LK.Client.Domain.Medias.Models;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration.Extensions
{
    public static class ImageMediaExtensions
    {
        private static StrapiClientSettings _strapiClientSettings;

        public static void Configure(StrapiClientSettings strapiClientSettings)
        {
            _strapiClientSettings = strapiClientSettings;
        }

        public static string GetAbsoluteUrl(this ImageMedia imageMedia)
        {
            if(imageMedia == null)
            {
                return null;
            }

            var baseUrl = new Uri(_strapiClientSettings.BaseUrl);

            return new Uri(baseUrl, imageMedia.Url).ToString();
        }
    }
}
