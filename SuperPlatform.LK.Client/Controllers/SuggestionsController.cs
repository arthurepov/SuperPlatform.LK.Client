using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Disciplines.Services;
using SuperPlatform.LK.Client.Domain.Organizations.Services;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Extensions;
using SuperPlatform.LK.Client.Models.Sections;
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

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupChildrenService _sectionGroupChildrenService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        public SuggestionsController(
            IMapper mapper,
            IDisciplineService disciplineService,
            IOrganizationService organizationService,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupChildrenService sectionGroupChildrenService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService)
        {
            _mapper = mapper;
            _disciplineService = disciplineService;
            _organizationService = organizationService;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupChildrenService = sectionGroupChildrenService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
        }

        /// <summary>
        /// Поиск по наименованию
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<SectionDetailsDto>>> Suggestion(string query)
        {
            if (query.Length < 3)
            {
                return BadRequest("Длина строки должна быть не меньше 3 символов.");
            }

            var sections = await _sectionService.Suggestion(query);

            var sectionGroups = await _sectionGroupService.GetBySections(sections.Select(x=>x.Id).ToArray());
            var sectionGroupChildren = await _sectionGroupChildrenService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupSchedules = await _sectionGroupScheduleService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupScheduleTimes = await _sectionGroupScheduleTimeService.GetBySectionGroupSchedules(sectionGroupSchedules.Select(x => x.Id).ToArray());

            var model = sections.Select(section => new SectionDetailsDto
            {
                Id = section.Id,
                Name = section.Name,
                RecordType = section.RecordType.HasValue ? (int?)section.RecordType : null,
                Address = section.Organization.address,
                MinAge = section.MinAge,
                MaxAge = section.MaxAge,
                OrganizationName = section.Organization.name,
                Longitude = section.Organization.longitude,
                Latitude = section.Organization.latitude,
                Cost = section.Cost,
                Duration = section.Duration,
                MaxPlacesCount = section.MaxPlacesCount,
                MinPlacesCount = section.MinPlacesCount,
                SectionGroups = sectionGroups
                    .Select(x => new SectionGroupDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        SectionGroupSchedules = sectionGroupSchedules.Where(y => y.SectionGroup.Id == x.Id).Select(y => new SectionGroupScheduleDto
                        {
                            Id = y.Id,
                            DayOfWeek = y.DayOfWeek.GetNumberValue(),
                            SectionGroupScheduleTimes = sectionGroupScheduleTimes.Where(z => z.SectionGroupSchedule.Id == y.Id).Select(z => new SectionGroupScheduleTimeDto
                            {
                                Id = z.Id,
                                StartTime = z.StartTime,
                                EndTime = z.EndTime
                            })
                            .OrderBy(x => x.StartTime)
                            .ToList()
                        })
                        .OrderBy(x => x.DayOfWeek)
                        .ToList()
                    })
                    .ToList()
            });

            return Ok(model);
        }
    }
}