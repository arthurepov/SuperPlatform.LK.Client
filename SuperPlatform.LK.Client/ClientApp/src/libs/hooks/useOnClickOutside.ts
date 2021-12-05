import { RefObject, useEffect, useRef } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

type TUseOnClickOutside = {
  ref: RefObject<any>;
};

export function useOnClickOutside(
  handler: (event: AnyEvent) => void
): TUseOnClickOutside {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event: AnyEvent): void => {
      const el = ref?.current;

      // @ts-ignore
      if (!el || el?.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener(`mousedown`, listener);
    document.addEventListener(`touchstart`, listener);

    return () => {
      document.removeEventListener(`mousedown`, listener);
      document.removeEventListener(`touchstart`, listener);
    };
  }, [ref, handler]);

  return { ref };
}
