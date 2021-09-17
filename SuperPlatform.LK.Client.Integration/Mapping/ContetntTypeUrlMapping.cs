using System;
using System.Collections.Generic;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Cities.Models;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using SuperPlatform.LK.Client.Domain.Sections.Models;
using SuperPlatform.LK.Client.Domain.Teachers.Models;

namespace SuperPlatform.LK.Client.Integration.Mapping
{
    public static class ContetntTypeUrlMapping
    {
        private static IDictionary<Type, string> _urlDictionary = new Dictionary<Type, string>
        {
            { typeof(Discipline), "disciplines" },
            { typeof(Direction), "directions" },
            { typeof(Teacher), "teachers" },
            { typeof(Domain.Organizations.Models.Organization), "organizations" },
            { typeof(Section), "sections" },
            { typeof(SectionGroup), "section-groups" },
            { typeof(SectionGroupSchedule), "section-schedules" },
            { typeof(StrapiChild), "children" },
            { typeof(SectionGroupChildren), "section-group-children" },
            { typeof(City), "cities"},
            { typeof(SectionGroupScheduleTime), "section-group-schedule-times" }
        };

        public static string GetContentUrl(Type type)
        {
            if (_urlDictionary.TryGetValue(type, out var value))
            {
                return value;
            }

            return string.Empty;
        }
    }
}
