import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { YMInitializer } from 'react-yandex-metrika';
import { YMID } from './constants';

import { Pages } from './pages';
import { getAllFromOCard } from './features/OK/model';

import 'normalize.css';
import './assets/styles/globalStyles.scss';
import { LayoutProvider, PortalProvider } from './libs';

export const Application: React.FC = () => {
  useEffect(() => {
    getAllFromOCard();
  }, []);

  return (
    <>
      <BrowserRouter>
        <LayoutProvider>
          <PortalProvider>
            <Pages />
          </PortalProvider>
        </LayoutProvider>
      </BrowserRouter>
      <YMInitializer
        accounts={[YMID]}
        options={{
          defer: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          trackHash: true,
        }}
        version="2"
      />
    </>
  );
};
