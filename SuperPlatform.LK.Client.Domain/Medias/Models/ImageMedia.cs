using SuperPlatform.LK.Client.Domain.Abstractions;

namespace SuperPlatform.LK.Client.Domain.Medias.Models
{
    public class ImageMedia : ImageMediaInfo, IEntity
    {
        public long Id { get; set; }

        public string Caption { get; set; }

        public ImageMediaFormat Formats { get; set; }
    }
}
