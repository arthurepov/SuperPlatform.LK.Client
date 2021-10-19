using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Services;
using SuperPlatform.LK.Client.Models.Disciplines;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class DisciplinesController : ControllerBase
    {
        private IMapper _mapper;

        private IDisciplineService _disciplineService;

        public DisciplinesController(IMapper mapper, IDisciplineService disciplineService)
        {
            _mapper = mapper;
            _disciplineService = disciplineService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<DisciplineDto>>> GetAll(int? skip = null, int? take = null, long? cityId = null, long? directionId = null)
        {
            var models = await _disciplineService.GetAll(skip, take, cityId, directionId);

            var mapped = _mapper.Map<IReadOnlyList<DisciplineDto>>(models.Data);

            return Ok(new PagedList<DisciplineDto>(mapped, models.TotalCount));
        }
    }
}
