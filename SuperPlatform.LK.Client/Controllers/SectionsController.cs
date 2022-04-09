using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Extensions;
using SuperPlatform.LK.Client.Models.Sections;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class SectionsController : ControllerBase
    {
        private IMapper _mapper;

        private readonly ISectionService _sectionService;

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupChildrenService _sectionGroupChildrenService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        public SectionsController(
            IMapper mapper,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupChildrenService sectionGroupChildrenService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService)
        {
            _mapper = mapper;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupChildrenService = sectionGroupChildrenService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SectionDetailsDto>> GetById([FromRoute] long id)
        {
            var section = await _sectionService.GetById(id);
            var sectionGroups = await _sectionGroupService.GetBySections(new[] { id });
            var sectionGroupChildren = await _sectionGroupChildrenService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupSchedules = await _sectionGroupScheduleService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupScheduleTimes = await _sectionGroupScheduleTimeService.GetBySectionGroupSchedules(sectionGroupSchedules.Select(x => x.Id).ToArray());

            var model = new SectionDetailsDto
            {
                Id = section.Id,
                Name = section.Name,
                RecordType = section.RecordType.HasValue ? (int?)section.RecordType : null,
                Address = section.Organization.address,
                IsRegisterByPhoneOnly = section.Organization.IsRegisterByPhoneOnly,
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
                            .OrderBy(x=>x.StartTime)
                            .ToList()
                        })
                        .OrderBy(x => x.DayOfWeek)
                        .ToList()
                    })
                    .ToList()
            };

            return Ok(model);
        }
    }
}
