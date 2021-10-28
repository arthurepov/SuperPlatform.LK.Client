using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Services;
using SuperPlatform.LK.Client.Models.Organizations;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using System.Linq;
using SuperPlatform.LK.Client.Integration.Extensions;
using SuperPlatform.LK.Client.Models.Sections;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class OrganizationsController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly IOrganizationService _organizationService;

        private readonly ISectionService _sectionService;

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        public OrganizationsController(
            IMapper mapper,
            IOrganizationService organizationService,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService)
        {
            _mapper = mapper;
            _organizationService = organizationService;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<OrganizationDto>>> GetAll(int? skip = null, int? take = null, long? cityId = null, long? directionId = null)
        {
            var models = await _organizationService.GetAll(skip, take, cityId, directionId);

            var mapped = _mapper.Map<IReadOnlyList<OrganizationDto>>(models.Data);

            return Ok(new PagedList<OrganizationDto>(mapped, models.TotalCount));
        }

        public async Task<ActionResult<OrganizationDetailsDto>> Get(long id)
        {
            var organization = await _organizationService.GetById(id);

            var model = new OrganizationDetailsDto
            {
                Id = organization.Id,
                Station = organization.Station,
                Address = organization.Address,
                Email = organization.Email,
                Latitude = organization.Latitude,
                Longitude = organization.Longitude,
                Name = organization.Name,
                Phone = organization.Phone,
                Photo = organization.Image == null ? null : new Models.Medias.ImageMediaDto { Id = organization.Image.Id, url = organization.Image.GetAbsoluteUrl() }
            };

            await FillSections(model);

            return Ok(model);
        }

        private async Task FillSections(OrganizationDetailsDto organization)
        {
            var sections = await _sectionService.GetByOrganization(organization.Id);

            var model = sections
                .Select(x => new SectionDto
                {
                    Id = x.Id,
                    Name = x.Name 
                })
                .ToList();

            await FillSectionGroups(model);

            organization.sections = model;
        }

        private async Task FillSectionGroups(IReadOnlyList<SectionDto> sections)
        {
            var sectionGroups = await _sectionGroupService.GetBySections(sections.Select(x => x.Id).ToArray());
            var schedules = await _sectionGroupScheduleService.GetBySectionGroups(sectionGroups.Select(x => x.Id).ToArray());
            var scheduleTimes = await _sectionGroupScheduleTimeService.GetBySectionGroupSchedules(schedules.Select(x => x.Id).ToArray());

            foreach (var item in sections)
            {
                var curSectionGroups = sectionGroups.Where(x => x.Section.Id == item.Id);

                item.SectionGroups = curSectionGroups
                    .Select(x => new SectionGroupDto
                    {
                        Id = x.Id,
                        Name = x.Name
                    })
                    .ToList();

                foreach(var sectionGroup in item.SectionGroups)
                {
                    var curSchedules = schedules.Where(x => x.SectionGroup.Id == sectionGroup.Id);

                    sectionGroup.SectionGroupSchedules = curSchedules
                        .Select(x => new SectionGroupScheduleDto
                        {
                            Id = x.Id,
                            DayOfWeek = (int)x.DayOfWeek
                        })
                        .ToList();

                    foreach (var schedule in sectionGroup.SectionGroupSchedules)
                    {
                        var curSchedulesTimes = scheduleTimes.Where(x => x.SectionGroupSchedule.Id == schedule.Id);

                        schedule.SectionGroupScheduleTimes = curSchedulesTimes
                            .Select(x => new SectionGroupScheduleTimeDto
                            {
                                Id = x.Id,
                                StartTime = x.StartTime,
                                EndTime = x.EndTime
                            })
                            .ToList();
                    }
                }
            }
        }
    }
}
