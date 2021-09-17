using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionTeacher : BaseEntity
    {
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }
    }
}
