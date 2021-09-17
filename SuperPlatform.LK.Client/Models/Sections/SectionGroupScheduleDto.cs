using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class SectionGroupScheduleDto
    {
        public long Id { get; set; }

        public int DayOfWeek { get; set; }

        public IReadOnlyList<SectionGroupScheduleTimeDto> SectionGroupScheduleTimes { get; set; }
    }
}
