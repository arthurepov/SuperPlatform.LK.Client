import { useContext } from 'react';
import { LayoutContext } from '../../LayoutProvider';
import noop from '../../noop';

export const TOP_LEVEL = 0;

export const useViewport = (): any => {
  const {
    viewport,
    scrollTo,
    lockTouch = noop,
    disableScroll,
    enableScroll,
  } = useContext(LayoutContext);

  return { viewport, lockTouch, scrollTo, disableScroll, enableScroll };
};
