import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { YMInitializer } from 'react-yandex-metrika';
import { ToastContainer } from 'react-toastify';
import { YMID } from './constants';
import { Pages } from './pages';
import { getData } from './components/model';
import { LayoutProvider, PortalProvider } from './libs';
import { ReactComponent as Cross } from './assets/images/close-cross.svg';
import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/globalStyles.scss';

export const Application: React.FC = () => {
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={<Cross />}
      />
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
