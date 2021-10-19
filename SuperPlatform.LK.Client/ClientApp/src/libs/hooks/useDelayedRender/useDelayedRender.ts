import React, { useState, useEffect, useRef } from 'react';

type UseDelayedRenderer = (
  isReadyToRender: boolean,
  onHide: () => void
) => [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const useDelayedRender: UseDelayedRenderer = (
  isReadyToRender,
  onHide
) => {
  const [isVisible, setIsVisible] = useState(false);
  const skipFirst = useRef(true);

  useEffect(() => {
    if (isReadyToRender) {
      setIsVisible(isReadyToRender);
    }
  }, [isReadyToRender]);

  useEffect(() => {
    // пропускаем первый вызов onHide, т.к. isVisible изначально false
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    if (!isVisible) {
      onHide();
    }
  }, [isVisible]);

  return [isVisible, setIsVisible];
};
