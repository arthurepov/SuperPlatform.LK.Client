using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Organizations.Services;
using SuperPlatform.LK.Client.Models.Organizations;

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

        public OrganizationsController(IMapper mapper, IOrganizationService organizationService)
        {
            _mapper = mapper;
            _organizationService = organizationService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<OrganizationDto>>> GetAll(int? skip = null, int? take = null, long? cityId = null, long? directionId = null)
        {
            var models = await _organizationService.GetAll(skip, take, cityId, directionId);

            var mapped = _mapper.Map<IReadOnlyList<OrganizationDto>>(models.Data);

            return Ok(new PagedList<OrganizationDto>(mapped, models.TotalCount));
        }
    }
}
