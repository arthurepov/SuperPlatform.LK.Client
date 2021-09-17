using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Cities.Models;
using SuperPlatform.LK.Client.Domain.Medias.Models;

namespace SuperPlatform.LK.Client.Domain.Organizations.Models
{
    public class Organization : BaseEntity
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string Station { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string Phone { get; set; }

        public City City { get; set; }

        public ImageMedia Image { get; set; }
    }
}
