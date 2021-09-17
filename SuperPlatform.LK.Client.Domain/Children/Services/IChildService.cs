using SuperPlatform.LK.Client.Domain.Children.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Children.Services
{
    public interface IChildService
    {
        Task<IReadOnlyList<Child>> GetByToken(string token);
    }
}
