import React, { useRef, useState, useEffect, FC } from 'react';
import { PortalContext, PortalState } from './PortalContext';

const defaultState = {
  isRendered: false,
  element: null,
};

export const PortalProvider: FC = ({ children }) => {
  const [state, setState] = useState<PortalState>(defaultState);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(
    function renderCheck() {
      setState({
        isRendered: true,
        element: ref.current,
      });
    },
    [ref.current]
  );

  return (
    <div>
      <div ref={ref} />
      <PortalContext.Provider value={state}>{children}</PortalContext.Provider>
    </div>
  );
};

export default PortalProvider;
