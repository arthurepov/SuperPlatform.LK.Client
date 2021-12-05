import { MediaQueryObject } from './types';

export function noop(): void {}

export function camelToHyphen(camelString: string): string {
  return camelString
    .replace(/[A-Z]/g, (string) => `-${string.toLowerCase()}`)
    .toLowerCase();
}

const QUERY_COMBINATOR = ' and ';

export function queryObjectToString(query: string | MediaQueryObject): string {
  if (typeof query === 'string') {
    return query;
  }

  return Object.entries(query)
    .map(([feature, value]) => {
      const convertedFeature = camelToHyphen(feature);
      let convertedValue = value;

      if (typeof convertedValue === 'boolean') {
        return convertedValue ? convertedFeature : `not ${convertedFeature}`;
      }

      if (
        typeof convertedValue === 'number' &&
        /[height|width]$/.test(convertedFeature)
      ) {
        convertedValue = `${convertedValue}px`;
      }

      return `(${convertedFeature}: ${convertedValue})`;
    })
    .join(QUERY_COMBINATOR);
}
