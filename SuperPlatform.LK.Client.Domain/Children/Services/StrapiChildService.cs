using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Children.Repositories;

namespace SuperPlatform.LK.Client.Domain.Children.Services
{
    public class StrapiChildService : BaseCrudService<StrapiChild>, IStrapiChildService
    {
        public StrapiChildService(IStrapiChildRepository repository) : base(repository) { }

        public async Task<IReadOnlyList<StrapiChild>> GetByPhone(string phone)
        {
            return await ((IStrapiChildRepository)Repository).GetByPhone(phone);
        }

        public async Task<StrapiChild> GetByEducationCardId(string educationCardId)
        {
            return await ((IStrapiChildRepository)Repository).GetByEducationCardId(educationCardId);
        }
    }
}