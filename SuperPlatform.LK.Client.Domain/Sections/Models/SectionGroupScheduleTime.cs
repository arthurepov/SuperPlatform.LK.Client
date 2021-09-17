using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionGroupScheduleTime : BaseEntity
    {
        public NamedEntity SectionGroupSchedule { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }
    }
}
