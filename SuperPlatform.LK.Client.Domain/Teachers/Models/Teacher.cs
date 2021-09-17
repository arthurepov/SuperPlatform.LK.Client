using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Medias.Models;

namespace SuperPlatform.LK.Client.Domain.Teachers.Models
{
    public class Teacher : PersonEntity
    {
        public BaseEntity Organization { get; set; }

        public NamedEntity Discipline { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Comment { get; set; }

        public ImageMedia Photo { get; set; }
    }
}
