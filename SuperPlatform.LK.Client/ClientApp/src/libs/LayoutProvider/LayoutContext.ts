import { createContext } from 'react';

const initialContextState = {
  viewport: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    margin: 0,
    marginHorizontal: 0,
    isWide: false,
  },
  layoutDataMap: {},
  lockTouch: (isLocked: boolean) => {},
  register: (id: string, layoutData: any) => {},
  update: (id: string, layoutData: any) => {},
  unregister: (id: string) => {},
  getVisibleItems: () => {},
  enableScroll: (context?: string) => {},
  scrollTo: (props: ScrollOptions, signal?: AbortSignal) => Promise.resolve(),
  disableScroll: (context?: string) => {},
  getScrollingElement: () => {},
};

export const LayoutContext = createContext(initialContextState);
