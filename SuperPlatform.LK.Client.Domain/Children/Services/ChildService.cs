using System.Collections.Generic;
using System.Threading.Tasks;
using SuperPlatform.LK.Client.Domain.Children.Models;
using SuperPlatform.LK.Client.Domain.Children.Repositories;

namespace SuperPlatform.LK.Client.Domain.Children.Services
{
    public class ChildService : IChildService
    {
        private readonly IChildRepository _childRepository;

        public ChildService(IChildRepository childRepository)
        {
            _childRepository = childRepository;
        }

        public async Task<IReadOnlyList<Child>> GetByToken(string token)
        {
            return await _childRepository.GetByToken(token);
        }
    }
}