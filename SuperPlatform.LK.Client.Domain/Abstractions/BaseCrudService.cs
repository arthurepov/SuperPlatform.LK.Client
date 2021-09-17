using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Abstractions
{
    public class BaseCrudService<T> : IBaseCrudService<T> where T : class, IEntity
    {
        protected readonly IBaseCrudRepository<T> Repository;

        public BaseCrudService(IBaseCrudRepository<T> repository)
        {
            Repository = repository;
        }

        public async Task<PagedList<T>> GetAll(int? skip, int? take)
        {
            return await Repository.GetAll(skip, take);
        }

        public async Task<T> GetById(long id)
        {
            return await Repository.GetById(id);
        }

        public async Task<IReadOnlyList<T>> GetByIds(long[] ids)
        {
            return await Repository.GetByIds(ids);
        }

        public virtual async Task<long> Create(T entity)
        {
            return await Repository.Create(entity);
        }

        public virtual async Task Update(T entity)
        {
            await Repository.Update(entity);
        }

        public async Task Delete(long id)
        {
            await Repository.Delete(id);
        }
    }
}
