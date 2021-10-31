using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Medias.Models;

namespace SuperPlatform.LK.Client.Integration.Models
{
    public class OrganizationResponse
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string name { get; set; }

        public string Address { get; set; }

        public string address { get; set; }

        public string Email { get; set; }

        public string email { get; set; }

        public string Station { get; set; }

        public string station { get; set; }

        public double? Latitude { get; set; }

        public double? latitude { get; set; }

        public double? Longitude { get; set; }

        public double? longitude { get; set; }

        public string Phone { get; set; }

        public string phone { get; set; }

        public NamedEntity City { get; set; }

        public NamedEntity city { get; set; }

        public ImageMedia Image { get; set; }

        public ImageMedia image { get; set; }

        public long? cityId { get; set; }
    }
}
