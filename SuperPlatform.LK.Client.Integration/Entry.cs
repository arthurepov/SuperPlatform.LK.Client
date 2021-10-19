using System;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Repositories;
using SuperPlatform.LK.Client.Domain.Directions.Repositories;
using SuperPlatform.LK.Client.Domain.Disciplines.Repositories;
using SuperPlatform.LK.Client.Domain.Sections.Repositories;
using SuperPlatform.LK.Client.Integration.Abstractions;
using SuperPlatform.LK.Client.Integration.Extensions;
using SuperPlatform.LK.Client.Integration.Repositories;
using SuperPlatform.LK.Client.Integration.Settings;

namespace SuperPlatform.LK.Client.Integration
{
    public static class Entry
    {
        public static IServiceCollection AddIntegration(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            var strapiSettings = new StrapiClientSettings();

            var settings = new ObrCardClientSettings
            {
                BaseUrl = configuration.GetSection("Authorize")["BaseUrl"]
            };

            configuration.Bind("StrapiClient", strapiSettings);

            serviceCollection.AddSingleton(strapiSettings);
            serviceCollection.AddSingleton(settings);
            serviceCollection.AddTransient(typeof(IBaseCrudRepository<>), typeof(BaseCrudRepository<>));
            serviceCollection.AddTransient<IChildRepository, ChildRepository>();
            serviceCollection.AddTransient<ISectionRepository, SectionRepository>();
            serviceCollection.AddTransient<ISectionGroupRepository, SectionGroupRepository>();
            serviceCollection.AddTransient<ISectionGroupChildrenRepository, SectionGroupChildrenRepository>();
            serviceCollection.AddTransient<ISectionGroupScheduleRepository, SectionGroupScheduleRepository>();
            serviceCollection.AddTransient<ISectionGroupScheduleTimeRepository, SectionGroupScheduleTimeRepository>();
            serviceCollection.AddTransient<IStrapiChildRepository, StrapiChildRepository>();
            serviceCollection.AddTransient<IDirectionRepository, DirectionRepository>();
            serviceCollection.AddTransient<IDisciplineRepository, DisciplineRepository>();

            ImageMediaExtensions.Configure(strapiSettings);

            serviceCollection
                .AddHttpClient(settings.ClientName,
                c =>
                {
                    c.BaseAddress = new Uri(settings.BaseUrl);
                    c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                })
                .ConfigurePrimaryHttpMessageHandler(() =>
                {
                    var httpClientHandler = new HttpClientHandler()
                    {
                        UseCookies = false,
                        UseDefaultCredentials = true,
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };
                    
                    return httpClientHandler;
                });

            serviceCollection
                .AddHttpClient(strapiSettings.ClientName,
                c =>
                {
                    c.BaseAddress = new Uri(strapiSettings.BaseUrl);
                    c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                })
                .ConfigurePrimaryHttpMessageHandler(() =>
                {
                    var httpClientHandler = new HttpClientHandler()
                    {
                        UseCookies = false,
                        UseDefaultCredentials = true,
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };

                    return httpClientHandler;
                });

            return serviceCollection;
        }
    }
}
