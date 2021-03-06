using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class SectionDetailsDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string OrganizationName { get; set; }

        public string Address { get; set; }

        public int MinAge { get; set; }

        public int MaxAge { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public int? RecordType { get; set; }

        public decimal? Cost { get; set; }

        public int MinPlacesCount { get; set; }

        public int MaxPlacesCount { get; set; }

        public int Duration { get; set; }

        public bool IsRegisterByPhoneOnly { get; set; }

        public string OrganizationPhone { get; set; }

        public IReadOnlyList<SectionGroupDto> SectionGroups { get; set; } = new List<SectionGroupDto>();
    }
}
