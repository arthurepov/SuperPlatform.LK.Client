﻿using Microsoft.Extensions.DependencyInjection;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Services;
using SuperPlatform.LK.Client.Domain.Sections.Services;

namespace SuperPlatform.LK.Client.Domain
{
    public static class Entry
    {
        public static IServiceCollection AddDomain(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient(typeof(IBaseCrudService<>), typeof(BaseCrudService<>));
            serviceCollection.AddTransient<IChildService, ChildService>();
            serviceCollection.AddTransient<ISectionService, SectionService>();
            serviceCollection.AddTransient<ISectionGroupService, SectionGroupService>();
            serviceCollection.AddTransient<ISectionGroupChildrenService, SectionGroupChildrenService>();
            serviceCollection.AddTransient<ISectionGroupScheduleService, SectionGroupScheduleService>();
            serviceCollection.AddTransient<ISectionGroupScheduleTimeService, SectionGroupScheduleTimeService>();
            serviceCollection.AddTransient<IStrapiChildService, StrapiChildService>();

            return serviceCollection;
        }
    }
}
