using System;
using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionGroupSchedule : BaseEntity
    {
        public NamedEntity SectionGroup { get; set; }

        public DayOfWeek DayOfWeek { get; set; }
    }
}
