import { useEffect, DependencyList } from 'react';

export const useResize = (
  onResize: (event: Event) => void,
  deps: DependencyList = [],
  isEnabled = true
): void => {
  useEffect(() => {
    if (isEnabled) {
      window.addEventListener('resize', onResize);
    }

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isEnabled, ...deps]);
};
