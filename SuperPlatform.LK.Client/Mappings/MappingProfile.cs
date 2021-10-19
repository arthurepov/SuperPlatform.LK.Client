using AutoMapper;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Cities.Models;
using SuperPlatform.LK.Client.Domain.Directions.Models;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using SuperPlatform.LK.Client.Domain.Medias.Models;
using SuperPlatform.LK.Client.Integration.Extensions;
using SuperPlatform.LK.Client.Models.Children;
using SuperPlatform.LK.Client.Models.Cities;
using SuperPlatform.LK.Client.Models.Directions;
using SuperPlatform.LK.Client.Models.Disciplines;
using SuperPlatform.LK.Client.Models.Medias;
using System.Linq;

namespace SuperPlatform.LK.Client.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ImageMedia, ImageMediaDto>()
                .ForMember(x => x.url, x => x.MapFrom(y => y.GetAbsoluteUrl()));

            CreateMap<Child, ChildDto>();

            CreateMap<Direction, DirectionDto>()
                .ForMember(x => x.Photo, x => x.MapFrom(y => y.Photo))
                .ForMember(x => x.AgeMin, x => x.MapFrom(y => y.Disciplines.Min(x => x.AgeMin)))
                .ForMember(x => x.AgeMax, x => x.MapFrom(y => y.Disciplines.Max(x => x.AgeMax)));

            CreateMap<Discipline, DisciplineDto>();

            CreateMap<City, CityDto>();
        }
    }
}