﻿using SuperPlatform.LK.Client.Domain.Abstractions;
using SuperPlatform.LK.Client.Domain.Disciplines.Models;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Disciplines.Services
{
    public interface IDisciplineService : IBaseCrudService<Discipline>
    {
        Task<PagedList<Discipline>> GetAll(int? skip, int? take, long? cityId, long? directionId);
    }
}