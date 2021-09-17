using System;

namespace SuperPlatform.LK.Client.Domain.Abstractions
{
    public class PersonEntity : BaseEntity
    {
        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public DateTime? Birthday { get; set; }

        public Gender? Gender { get; set; }
    }
}