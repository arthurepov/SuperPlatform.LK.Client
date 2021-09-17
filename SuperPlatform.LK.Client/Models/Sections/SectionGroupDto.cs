using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class SectionGroupDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public IReadOnlyList<SectionGroupScheduleDto> SectionGroupSchedules { get; set; }
    }
}
