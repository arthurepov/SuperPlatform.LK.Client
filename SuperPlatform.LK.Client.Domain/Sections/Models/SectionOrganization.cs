using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Sections.Models
{
    public class SectionOrganization : BaseEntity
    {
        public string Name { get; set; }

        public string name { get; set; }

        public string Address { get; set; }

        public string address { get; set; }

        public string Email { get; set; }

        public string Station { get; set; }

        public string station { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public double? latitude { get; set; }

        public double? longitude { get; set; }

        public string Phone { get; set; }

        public bool IsRegisterByPhoneOnly { get; set; }
    }
}
