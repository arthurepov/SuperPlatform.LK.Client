using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Children.Services;
using SuperPlatform.LK.Client.Domain.Sections.Services;
using SuperPlatform.LK.Client.Models.Children;
using SuperPlatform.LK.Client.Models.Sections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class ChildrenController : ControllerBase
    {
        private IMapper _mapper;

        private readonly IChildService _childService;

        private readonly IStrapiChildService _strapiChildService;

        private readonly ISectionService _sectionService;

        private readonly ISectionGroupService _sectionGroupService;

        private readonly ISectionGroupScheduleService _sectionGroupScheduleService;

        private readonly ISectionGroupScheduleTimeService _sectionGroupScheduleTimeService;

        private readonly ISectionGroupChildrenService _sectionGroupChildrenService;

        public ChildrenController(
            IMapper mapper,
            IChildService childService,
            IStrapiChildService strapiChildService,
            ISectionService sectionService,
            ISectionGroupService sectionGroupService,
            ISectionGroupScheduleService sectionGroupScheduleService,
            ISectionGroupScheduleTimeService sectionGroupScheduleTimeService,
            ISectionGroupChildrenService sectionGroupChildrenService) 
        {
            _mapper = mapper;
            _childService = childService;
            _strapiChildService = strapiChildService;
            _sectionService = sectionService;
            _sectionGroupService = sectionGroupService;
            _sectionGroupScheduleService = sectionGroupScheduleService;
            _sectionGroupScheduleTimeService = sectionGroupScheduleTimeService;
            _sectionGroupChildrenService = sectionGroupChildrenService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ChildDto>>> Get()
        {
            var token = await HttpContext.GetTokenAsync("access_token");
            var children = await _childService.GetByToken(token);
            var childrenDto = _mapper.Map<IReadOnlyList<ChildDto>>(children);

            foreach (var child in childrenDto)
            {
                child.Sections = await GetChildSectionsImpl(HttpUtility.UrlDecode(child.Id));
            }

            return Ok(childrenDto);
        }

        [HttpPost("{id}/sections")]
        public async Task<ActionResult> AddChildToSectionGroup([FromRoute] string id, [FromBody] RecordChildToSectionRequest request)
        {
            var decodeId = HttpUtility.UrlDecode(id);
            var strapiChild = await GetStrapiChildByChildId(decodeId);
            if (strapiChild == null)
            {
                var token = await HttpContext.GetTokenAsync("access_token");
                var children = await _childService.GetByToken(token);
                var child = children.First(x => x.Id == decodeId);
                var nameSplit = child.FullName.Split(" ");

                strapiChild = new StrapiChild
                {
                    EducationCardChildId = decodeId,
                    LastName = nameSplit[0],
                    FirstName = nameSplit[1],
                    MiddleName = nameSplit.Count() == 3 ? nameSplit[2] : null
                };

                strapiChild.Id = await _strapiChildService.Create(strapiChild);
            }

            if (strapiChild.EducationCardChildId == null)
            {
                strapiChild.EducationCardChildId = decodeId;

                await _strapiChildService.Update(strapiChild);
            }

            var exisstGroupChild = await _sectionGroupChildrenService.GetByChild(strapiChild.Id);
            if(exisstGroupChild.Any(x=>x.SectionGroup.Id == request.SectionGroupId))
            {
                return BadRequest($"Ребенок уже записан в группу");
            }

            await _sectionGroupChildrenService.Create(new Domain.Sections.Models.SectionGroupChildren
            {
                Child = new StrapiChild { Id = strapiChild.Id },
                SectionGroup = new Domain.Abstractions.NamedEntity { Id = request.SectionGroupId }
            });

            return Ok();
        }

        [HttpGet("{id}/sectionGroups/count")]
        public async Task<ActionResult<int>> GetChildSectionCount([FromRoute] string id)
        {
            var decodeId = HttpUtility.UrlDecode(id);
            var strapiChild = await GetStrapiChildByChildId(decodeId);
            if (strapiChild == null)
            {
                return Ok(0);
            }

            var childSectionGroups = await _sectionGroupChildrenService.GetByChild(strapiChild.Id);

            var count = childSectionGroups.Count();

            return Ok(count);
        }

        [HttpGet("{id}/sections")]
        public async Task<ActionResult<IReadOnlyList<SectionShortDto>>> GetChildSections([FromRoute] string childId)
        {
            var decodeId = HttpUtility.UrlDecode(childId);
            var childrenSections = await GetChildSectionsImpl(decodeId);

            return Ok(childrenSections);
        }

        [HttpDelete("{childId}/sectionGroups/{sectionGroupId}")]
        public async Task<ActionResult> DeleteChildFromSectionGroup([FromRoute] string childId, [FromRoute] long sectionGroupId)
        {
            var decodeId = HttpUtility.UrlDecode(childId);
            var strapiChild = await GetStrapiChildByChildId(decodeId);
            var childSectionGroups = await _sectionGroupChildrenService.GetByChild(strapiChild.Id);
            var childSectionGroup = childSectionGroups.FirstOrDefault(x => x.SectionGroup.Id == sectionGroupId);
            if(childSectionGroup == null)
            {
                return NotFound("Запись в группе не найдена!");
            }

            await _sectionGroupChildrenService.Delete(childSectionGroup.Id);

            return Ok();
        }

        private async Task<StrapiChild> GetStrapiChildByChildId(string id)
        {
            var strapiChild = await _strapiChildService.GetByEducationCardId(id);
            if(strapiChild != null)
            {
                return strapiChild;
            }

            var phone = User.Claims.First(x => x.Type == ClaimTypes.MobilePhone).Value;
            var token = HttpContext.GetTokenAsync("access_token").Result;
            var childs = await _childService.GetByToken(token);
            var child = childs.First(x => x.Id == id);
            var strapiChilds = await _strapiChildService.GetByPhone(phone);

            return strapiChilds.FirstOrDefault(x => $"{x.LastName} {x.FirstName} {x.MiddleName}" == child.FullName);
        }

        private async Task<IReadOnlyList<SectionShortDto>> GetChildSectionsImpl(string childId)
        {
            var strapiChild = await GetStrapiChildByChildId(childId);
            if (strapiChild == null)
            {
                return new List<SectionShortDto>(0);
            }

            var childSectionGroups = await _sectionGroupChildrenService.GetByChild(strapiChild.Id);
            var sectionGroups = await _sectionGroupService.GetByIds(childSectionGroups.Select(x => x.SectionGroup.Id).ToArray());
            var sections = await _sectionService.GetByIds(sectionGroups.Select(x => x.Section.Id).ToArray());

            var model = sectionGroups
                .Select(x => new
                {
                    Section = sections.First(y => y.Id == x.Section.Id),
                    SectionGroup = x
                })
                .Select(
                x => new SectionShortDto
                {
                    SectionGroupId = x.SectionGroup.Id,
                    SectionId = x.Section.Id,
                    SectionName = x.Section.Name,
                    SectionGroupName = x.SectionGroup.Name,
                    DirectionName = x.Section.Direction.Name,
                    DIsciplineName = x.Section.Discipline.Name,
                    OrganizationName = x.Section.Organization.Name
                })
                .ToList();

            return model;
        }
    }
}