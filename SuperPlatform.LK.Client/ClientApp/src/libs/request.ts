import { promiseDelay } from './promiseDelay';

export interface IRequest {
  url: RequestInfo;
  options?: RequestInit;
  delay?: number;
}

export function request<T>({ url, options, delay }: IRequest) {
  return async (): Promise<T> => {
    try {
      if (delay) {
        await promiseDelay(delay);
      }

      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');

      let data;

      if (contentType?.includes('json')) {
        data = await response.json();
      }

      if (contentType?.includes('text')) {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data?.message ?? data);
      }

      return data;
    } catch ({ message }) {
      return Promise.reject(new Error(message));
    }
  };
}
