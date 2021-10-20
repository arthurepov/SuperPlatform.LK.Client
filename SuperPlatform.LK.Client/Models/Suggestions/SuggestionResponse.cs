using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Models.Suggestions
{
    public class SuggestionResponse
    {
        public IReadOnlyList<SuggestionDiscipleneDto> SuggestionDisciplenes { get; set; }

        public IReadOnlyList<SuggestionOrganizationDto> SggestionOrganizations { get; set; }

        public IReadOnlyList<SuggestionSectionDto> SuggestionSections { get; set; }
    }
}
