using SuperPlatform.LK.Client.Models.Medias;
using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Disciplines
{
    public class DisciplineDto
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public int? AgeMin { get; set; }

        public int AgeMax { get; set; }

        public IReadOnlyList<ImageMediaDto> Photo { get; set; }
    }
}
