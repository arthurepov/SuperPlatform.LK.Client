using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Suggestions
{
    public class SuggestionResponse
    {
        public IReadOnlyList<SuggestionDisciplineDto> SuggestionDisciplenes { get; set; }

        public IReadOnlyList<SuggestionOrganizationDto> SggestionOrganizations { get; set; }

        public IReadOnlyList<SuggestionSectionDto> SuggestionSections { get; set; }
    }
}
