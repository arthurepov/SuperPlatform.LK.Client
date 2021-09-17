using System.Collections.Generic;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Medias.Models;

namespace SuperPlatform.LK.Client.Domain.Disciplines.Models
{
    public class Discipline : NamedEntity
    {
        public IReadOnlyList<ImageMedia> Photo { get; set; }

        public int? AgeMin { get; set; }

        public int? AgeMax { get; set; }
    }
}
