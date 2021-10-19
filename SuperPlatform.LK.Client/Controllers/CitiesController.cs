using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Cities.Models;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using SuperPlatform.LK.Client.Models.Cities;


namespace SuperPlatform.LK.Client.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiController]
    [Authorize]
    public class CitiesController : ControllerBase
    {
        private IMapper _mapper;

        private readonly IBaseCrudService<City> _cityService;

        public CitiesController(IMapper mapper, IBaseCrudService<City> cityService)
        {
            _mapper = mapper;
            _cityService = cityService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<City>>> GetAll(int? skip = null, int? take = null)
        {
            var models = await _cityService.GetAll(skip, take);

            var mapped = _mapper.Map<IReadOnlyList<CityDto>>(models.Data);

            return Ok(new PagedList<CityDto>(mapped, models.TotalCount));
        }
    }
}
