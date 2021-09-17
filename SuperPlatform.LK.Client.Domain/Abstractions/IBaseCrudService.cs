using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPlatform.LK.Client.Domain.Abstractions
{
    public interface IBaseCrudService<T> where T : class, IEntity
    {
        Task<PagedList<T>> GetAll(int? skip, int? take);

        Task<T> GetById(long id);

        Task<IReadOnlyList<T>> GetByIds(long[] ids);

        Task<long> Create(T entity);

        Task Update(T entity);

        Task Delete(long id);
    }
}
