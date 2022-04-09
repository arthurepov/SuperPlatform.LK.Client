using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class ChildSectionDto
    {
        public long Id { get; set; }

        public int MinAge { get; set; }

        public int MaxAge { get; set; }

        public string DirectionName { get; set; }

        public string OrganizationName { get; set; }

        public string Address { get; set; }

        public string Station { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string SectionName { get; set; }

        public int? RecordType { get; set; }

        public decimal? Cost { get; set; }

        public int? CostDuration { get; set; }

        public int PlacesCount { get; set; }

        public int FreePlacesCount { get; set; }

        public IReadOnlyList<SectionGroupDto> SectionGroups { get; set; }

        public bool IsRegisterByPhoneOnly { get; set; }
    }
}
