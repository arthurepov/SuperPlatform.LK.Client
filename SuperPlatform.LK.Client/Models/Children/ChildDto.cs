using SuperPlatform.LK.Client.Models.Sections;
using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Children
{
    public class ChildDto
    {
        public string Id { get; set; }

        public string FullName { get; set; }

        public string Avatar { get; set; }

        public IReadOnlyList<SectionShortDto> Sections { get; set; }
    }
}
