using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class SectionGroupDetailsDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string SectionName { get; set; }

        public string OrganizationName { get; set; }

        public string Address { get; set; }

        public int? RecordType { get; set; }

        public decimal? Cost { get; set; }

        public int? CostDuration { get; set; }

        public string TeacherFullName { get; set; }

        public string TeacherPhoto { get; set; }

        public IReadOnlyList<SectionGroupScheduleDto> SectionGroupSchedules { get; set; }
    }
}
