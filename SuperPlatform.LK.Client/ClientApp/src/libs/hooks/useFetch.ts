import { useEffect, useState } from 'react';
import { request, IRequest } from '../request';

interface IUseFetch<T> {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>({ url, options, delay }: IRequest): IUseFetch<T> {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [stringifiedUrl, stringifiedOptions] = [JSON.stringify(url), JSON.stringify(options)];

    const fetchApi = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await request<T>({ url, options, delay })();

            setData(result);
        } catch ({ message }) {
            console.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (url) {
            fetchApi();
        }
    }, [stringifiedUrl, stringifiedOptions]);

    return {
        data,
        loading,
        error,
        refetch: fetchApi,
    };
}
