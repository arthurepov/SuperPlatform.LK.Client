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

        /// <summary>
        /// Поиск по наименованию
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<SuggestionResponse>> Suggestion(string query)
        {
            if (query.Length < 3)
            {
                return BadRequest("Длина строки должна быть не меньше 3 символов.");
            }

            var disciplines = await _disciplineService.Suggestion(query);
            var organizations = await _organizationService.Suggestion(query);
            var sections = await _sectionService.Suggestion(query);

            var responsew = new SuggestionResponse
            {
                SuggestionDisciplenes = _mapper.Map<IReadOnlyList<SuggestionDisciplineDto>>(disciplines),
                SggestionOrganizations = _mapper.Map<IReadOnlyList<SuggestionOrganizationDto>>(organizations),
                SuggestionSections = _mapper.Map<IReadOnlyList<SuggestionSectionDto>>(sections)
            };

            return Ok(responsew);
        }
    }
}