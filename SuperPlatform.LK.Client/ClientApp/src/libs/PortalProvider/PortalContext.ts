import { createContext } from 'react';

export type PortalState = {
  isRendered: boolean;
  element: HTMLDivElement | null;
};

export const PortalContext = createContext<PortalState>({
  isRendered: false,
  element: null,
});
