import { useEffect, useLayoutEffect, useState } from 'react';

type ReturnType = {
  toggleBodyScroll: () => void;
  disableScroll: () => void;
  enableScroll: () => void;
};

export function useLockBodyScroll(initialLocked = false): ReturnType {
  const [locked, setLocked] = useState(initialLocked);

  useLayoutEffect(() => {
    if (!locked) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const html = document.querySelector('html');
    document.body.style.overflow = 'hidden';

    if (html) {
      html.style.overflow = 'hidden';
    }

    const root = document.getElementById('app');
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.overflow = originalOverflow;

      if (html) {
        html.style.overflow = originalOverflow;
      }

      if (scrollBarWidth) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);

  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocked]);

  const toggleBodyScroll = (): void => {
    setLocked((prevState) => !prevState);
  };

  const disableScroll = (): void => {
    setLocked(true);
  };

  const enableScroll = (): void => {
    setLocked(false);
  };

  return { toggleBodyScroll, disableScroll, enableScroll };
}
