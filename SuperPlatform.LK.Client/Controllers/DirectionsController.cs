using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Directions.Services;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Extensions;
using SuperPlatform.LK.Client.Models.Directions;
using SuperPlatform.LK.Client.Models.Sections;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class DirectionsController : ControllerBase
    {
        private IMapper _mapper;

        private readonly IDirectionService _directionService;

        private readonly ISectionService _sectionService;

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupChildrenService _sectionGroupChildrenService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        public DirectionsController(
            IMapper mapper,
            IDirectionService directionService,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupChildrenService sectionGroupChildrenService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService)
        {
            _mapper = mapper;
            _directionService = directionService;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupChildrenService = sectionGroupChildrenService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<DirectionDto>>> GetAll(int? skip = null, int? take = null, long? cityId = null)
        {
            var models = await _directionService.GetAll(skip, take, cityId);

            var mapped = _mapper.Map<IReadOnlyList<DirectionDto>>(models.Data);

            return Ok(new PagedList<DirectionDto>(mapped, models.TotalCount));
        }

        [HttpGet("{id}/sections")]
        public async Task<ActionResult<PagedList<ChildSectionDto>>> GetSectionsByDirection([FromRoute] long id, [FromQuery] int? filterByAge = null, int? skip = null, int? take = null)
        {
            var list = new List<ChildSectionDto>();
            var sections = await _sectionService.GetByDirection(id, skip, take);
            var sectionGroups = await _sectionGroupService.GetBySections(sections.Data.Select(x => x.Id).ToArray());
            var sectionGroupChildren = await _sectionGroupChildrenService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupSchedules = await _sectionGroupScheduleService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var sectionGroupScheduleTimes = await _sectionGroupScheduleTimeService.GetBySectionGroupSchedules(sectionGroupSchedules.Select(x => x.Id).ToArray());

            foreach (var section in sections.Data)
            {
                var groups = sectionGroups.Where(x => x.Section.Id == section.Id).ToList();
                var children = sectionGroupChildren.Where(x => groups.Any(y => y.Id == x.SectionGroup.Id));
                var schedules = sectionGroupSchedules.Where(x => groups.Any(y => y.Id == x.SectionGroup.Id));
                var scheduleTimes = sectionGroupScheduleTimes.Where(x => schedules.Any(y => y.Id == x.SectionGroupSchedule.Id));

                list.Add(new ChildSectionDto
                {
                    Id = section.Id,
                    MinAge = section.MinAge,
                    MaxAge = section.MaxAge,
                    OrganizationName = section.Organization?.name,
                    DirectionName = section.Direction?.Name,
                    SectionName = section.Name,
                    Station = section.Organization?.station,
                    Address = section.Organization?.address,
                    Longitude = section.Organization?.longitude,
                    Latitude = section.Organization?.latitude,
                    RecordType = (int?)section.RecordType,
                    Cost = section.Cost,
                    CostDuration = (int?)section.CostDuration,
                    PlacesCount = section.MaxPlacesCount,
                    FreePlacesCount = section.MaxPlacesCount - children.Count(),
                    IsRegisterByPhoneOnly = section.Organization.IsRegisterByPhoneOnly,
                    OrganizationPhone = section.Organization.Phone,
                    SectionGroups = groups.Select(x => new SectionGroupDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        SectionGroupSchedules = schedules.Where(y=>y.SectionGroup.Id == x.Id).Select(y => new SectionGroupScheduleDto
                        {
                            Id = y.Id,
                            DayOfWeek = y.DayOfWeek.GetNumberValue(),
                            SectionGroupScheduleTimes = scheduleTimes.Where(z=>z.SectionGroupSchedule.Id == y.Id).Select(z=>new SectionGroupScheduleTimeDto 
                            {
                                Id = z.Id,
                                StartTime = z.StartTime,
                                EndTime = z.EndTime
                            })
                            .ToList()
                        })
                        .ToList()
                    })
                    .ToList()
                });
            }

            return Ok(new PagedList<ChildSectionDto>(list, sections.TotalCount));
        }
    }
}