using System.Collections.Generic;
using SuperPlatform.LK.Client.Models.Medias;

namespace SuperPlatform.LK.Client.Models.Directions
{
    public class DirectionDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public int? AgeMin { get; set; }

        public int AgeMax { get; set; }

        public IReadOnlyList<ImageMediaDto> Photo { get; set; }
    }
}
