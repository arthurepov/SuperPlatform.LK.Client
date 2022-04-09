using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Children.Models
{
    public class StrapiChild : PersonEntity
    {
        public string EducationCardChildId { get; set; }

        public string Phone { get; set; }

        // public string Email { get; set; }
    }
}
