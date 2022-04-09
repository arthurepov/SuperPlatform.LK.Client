using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Domain.Teachers.Models;
using SuperPlatform.LK.Client.Extensions;
using SuperPlatform.LK.Client.Integration.Extensions;
using SuperPlatform.LK.Client.Models.Sections;
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
    public class SectionGroupController : ControllerBase
    {
        private IMapper _mapper;

        private readonly IBaseCrudService<Teacher> _teacherService;

        private readonly ISectionService _sectionService;

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        public SectionGroupController(
            IMapper mapper,
            IBaseCrudService<Teacher> teacherService,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService)
        {
            _mapper = mapper;
            _teacherService = teacherService;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SectionGroupDetailsDto>> Get([FromRoute] long id)
        {
            var group = await _sectionGroupService.GetById(id);
            if (group == null)
            {
                return NotFound();
            }

            var section = await _sectionService.GetById(group.Section.Id);
            var teacher =  section.Teacher != null ? await _teacherService.GetById(section.Teacher.Id) : null;
            var schedules = await _sectionGroupScheduleService.GetBySectionGroup(id);
            var scheduleTimes = await _sectionGroupScheduleTimeService.GetBySectionGroupSchedules(schedules.Select(x => x.Id).ToArray());

            return Ok(new SectionGroupDetailsDto
            {
                Id = group.Id,
                Name = group.Name,
                SectionName = section.Name,
                OrganizationName = section.Organization.name,
                Address = section.Organization.address,
                Cost = section.Cost,
                CostDuration = (int?)section.CostDuration,
                RecordType = (int?)section.RecordType,
                TeacherFullName = teacher == null ? string.Empty : $"{section.Teacher?.LastName} {section.Teacher?.FirstName} {section.Teacher?.MiddleName}",
                TeacherPhoto = teacher == null ? string.Empty : teacher?.Photo?.GetAbsoluteUrl(),
                IsRegisterByPhoneOnly = section.Organization.IsRegisterByPhoneOnly,
                SectionGroupSchedules = schedules.Select(x=>new SectionGroupScheduleDto 
                {
                    Id = x.Id,
                    DayOfWeek = x.DayOfWeek.GetNumberValue(),
                    SectionGroupScheduleTimes = scheduleTimes.Where(y=>y.SectionGroupSchedule.Id == x.Id).Select(y => new SectionGroupScheduleTimeDto
                    {
                        Id = y.Id,
                        StartTime = y.StartTime,
                        EndTime = y.EndTime
                    })
                    .OrderBy(x=>x.StartTime)
                    .ToList()
                })
                .OrderBy(x=>x.DayOfWeek)
                .ToList()
            });
        }
    }
}
