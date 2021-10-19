import { useEffect, MutableRefObject, DependencyList } from 'react';

export enum Pan {
  Start = 'PAN_START',
  Move = 'PAN_MOVE',
  End = 'PAN_END',
}

type PanState = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  state: Pan;
};
type InitialTouch = {
  startX: number;
  startY: number;
};

const getPan = (
  event: TouchEvent,
  state: Pan,
  { startX, startY }: InitialTouch
): PanState => {
  const { clientX: x, clientY: y } =
    event.changedTouches[0] || event.touches[0];

  return { x, y, startX, startY, state };
};

export const usePan = (
  handlePan: (event: TouchEvent, panState: PanState) => void,
  deps: DependencyList = [],
  isEnabled = true,
  ref: MutableRefObject<HTMLElement> | null = null
): void => {
  useEffect(() => {
    const element = ref ? ref.current : document.body;
    let dragStart = false;

    const initialTouch: InitialTouch = {
      startX: 0,
      startY: 0,
    };

    const handlePanStart = (event: TouchEvent): void => {
      const touch = event.changedTouches[0] || event.touches[0];

      dragStart = true;
      initialTouch.startX = touch.clientX;
      initialTouch.startY = touch.clientY;

      handlePan(event, getPan(event, Pan.Start, initialTouch));
    };
    const handlePanMove = (event: TouchEvent): void => {
      if (!dragStart) return;
      handlePan(event, getPan(event, Pan.Move, initialTouch));
    };

    const handlePanEnd = (event: TouchEvent): void => {
      dragStart = false;
      handlePan(event, getPan(event, Pan.End, initialTouch));
    };

    if (isEnabled && element) {
      element.addEventListener('touchstart', handlePanStart, {
        passive: false,
      });
      element.addEventListener('touchmove', handlePanMove, { passive: false });
      element.addEventListener('touchend', handlePanEnd, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handlePanStart);
        element.removeEventListener('touchmove', handlePanMove);
        element.removeEventListener('touchend', handlePanEnd);
      }
    };
  }, [isEnabled, ref && ref.current, ...deps]);
};
