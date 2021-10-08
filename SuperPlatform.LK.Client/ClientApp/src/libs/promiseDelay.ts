import { TWO_SECONDS } from '../constants';

export const promiseDelay = (ms = TWO_SECONDS): Promise<any> => new Promise((resolve) => setTimeout(resolve, ms));
