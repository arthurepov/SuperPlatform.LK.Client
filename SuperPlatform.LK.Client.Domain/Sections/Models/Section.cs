using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class Section : NamedEntity
    {
        public SectionOrganization Organization { get; set; }

        public NamedEntity Direction { get; set; }

        public NamedEntity Discipline { get; set; }

        public RecordType? RecordType { get; set; }

        public decimal? Cost { get; set; }

        public int MinAge { get; set; }

        public int MaxAge { get; set; }

        public int MinPlacesCount { get; set; }

        public int MaxPlacesCount { get; set; }

        public int Duration { get; set; }

        public SectionTeacher Teacher { get; set; }

        public CostDuration? CostDuration { get; set; }
    }
}