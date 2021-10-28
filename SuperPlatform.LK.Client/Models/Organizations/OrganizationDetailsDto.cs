using SuperPlatform.LK.Client.Models.Sections;
using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Organizations
{
    public class OrganizationDetailsDto : OrganizationDto
    {
        public IReadOnlyList<SectionDto> sections { get; set; }
    }
}
