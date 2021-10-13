import { FC, useRef, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PortalContext } from '../../../libs';

export const Portal: FC = ({ children }) => {
  const rootContext = useContext(PortalContext);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rootElement = rootContext.element || rootRef.current;

  useEffect(function appendPortal() {
    if (!rootContext.element) {
      rootRef.current = document.createElement('div');
      document.body.appendChild(rootRef.current);
    }

    return () => {
      if (!rootContext.element && rootRef.current) {
        document.body.removeChild(rootRef.current);
      }
    };
  }, []);

  if (rootElement) {
    return createPortal(children, rootElement);
  }

  return null;
};

Portal.displayName = 'Portal';
