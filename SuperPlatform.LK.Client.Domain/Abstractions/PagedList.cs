using System.Collections.Generic;

namespace SuperPlatform.LK.Client.Domain.Abstractions
{
    public class PagedList<T> where T : class
    {
        public PagedList(IReadOnlyList<T> data, int totalCount)
        {
            Data = data;
            TotalCount = totalCount;
        }

        public int TotalCount { get; }

        public IReadOnlyList<T> Data { get; }
    }
}
