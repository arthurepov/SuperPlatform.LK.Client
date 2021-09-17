using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionGroup : NamedEntity
    {
        public NamedEntity Section { get; set; }
    }
}
