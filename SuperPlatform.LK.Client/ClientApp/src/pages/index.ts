import { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { useLocation } from 'react-router-dom';
import ym from 'react-yandex-metrika';
import { ROUTES } from './routes';

export const Pages: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const { pathname, search } = location;

    ym('hit', `${pathname}${search}`);
  }, [location]);

  return renderRoutes(ROUTES);
};
