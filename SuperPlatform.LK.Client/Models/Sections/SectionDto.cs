using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Sections
{
    public class SectionDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public IReadOnlyList<SectionGroupDto> SectionGroups { get; set; }
    }
}
