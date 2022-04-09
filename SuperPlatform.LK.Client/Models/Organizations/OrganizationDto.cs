using SuperPlatform.LK.Client.Models.Medias;

namespace SuperPlatform.LK.Client.Models.Organizations
{
    public class OrganizationDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string Station { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string Phone { get; set; }

        public ImageMediaDto Photo { get; set; }

        public bool IsRegisterByPhoneOnly { get; set; }
    }
}
