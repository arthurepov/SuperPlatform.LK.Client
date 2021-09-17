using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Children.Models;

namespace SuperPlatform.LK.Client.Domain.Children.Services
{
    public interface IStrapiChildService : IBaseCrudService<StrapiChild>
    {
        Task<IReadOnlyList<StrapiChild>> GetByPhone(string phone);

        Task<StrapiChild> GetByEducationCardId(string educationCardId);
    }
}
