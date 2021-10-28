using SuperPlatform.LK.Client.Models.Medias;

namespace SuperPlatform.LK.Client.Models.Suggestions
{
    public class SuggestionOrganizationDto
    { 
        public long Id { get; set; }

        public string Name { get; set; }

        public ImageMediaDto Image { get; set; }
    }
}
