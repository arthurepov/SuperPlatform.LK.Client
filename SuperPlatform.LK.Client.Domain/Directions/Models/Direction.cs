using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using SuperPlatform.LK.Client.Domain.Medias.Models;
using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Domain.Directions.Models
{
    public class Direction : NamedEntity
    {
        public IReadOnlyList<ImageMedia> Photo { get; set; }

        public IReadOnlyList<Discipline> Disciplines { get; set; } = new List<Discipline>();
    }
}
