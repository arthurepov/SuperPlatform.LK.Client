using SuperPlatform.LK.Client.Domain.Children.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Children.Repositories
{
    public interface IChildRepository
    {
        Task<IReadOnlyList<Child>> GetByToken(string token);
    }
}
