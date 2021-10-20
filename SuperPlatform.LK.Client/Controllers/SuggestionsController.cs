using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Disciplines.Services;
using SuperPlatform.LK.Client.Domain.Organizations.Services;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Models.Suggestions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class SuggestionsController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly IDisciplineService _disciplineService;

        private readonly IOrganizationService _organizationService;

        private readonly ISectionService _sectionService;

        public SuggestionsController(
            IMapper mapper,
            IDisciplineService disciplineService,
            IOrganizationService organizationService,
            ISectionService sectionService)
        {
            _mapper = mapper;
            _disciplineService = disciplineService;
            _organizationService = organizationService;
            _sectionService = sectionService;
        }

        public async Task<ActionResult<SuggestionResponse>> Suggestion(string query)
        {
            var responsew = new SuggestionResponse
            {
                SuggestionDisciplenes = new List<SuggestionDiscipleneDto> { new SuggestionDiscipleneDto { Id = 1, Name = "Тестовая дисциплина" } },
                SggestionOrganizations = new List<SuggestionOrganizationDto> { new SuggestionOrganizationDto { Id = 1, Name = "Тестовая организация" } },
                SuggestionSections = new List<SuggestionSectionDto> { new SuggestionSectionDto { Id = 1, Name = "Тестовая секция" } }
            };

            return Ok(responsew);
        }
    }
}
