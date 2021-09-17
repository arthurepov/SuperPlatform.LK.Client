using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Models;

namespace SuperPlatform.LK.Client.Domain.Children.Repositories
{
    public interface IStrapiChildRepository : IBaseCrudRepository<StrapiChild>
    {
        Task<IReadOnlyList<StrapiChild>> GetByPhone(string phone);

        Task<StrapiChild> GetByEducationCardId(string educationCardId);
    }
}