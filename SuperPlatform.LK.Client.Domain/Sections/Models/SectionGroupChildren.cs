using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Models;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionGroupChildren : BaseEntity
    {
        public NamedEntity SectionGroup { get; set; }

        public StrapiChild Child { get; set; }
    }
}
