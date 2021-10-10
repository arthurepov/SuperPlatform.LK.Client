import { Home } from './home';
import { Error404Page } from './error404';
import {
  OneDicsiplinePage,
  AllDisciplinesPage,
  AllOrganizationsPage,
  OrganizationPage,
  MapPage,
  AllOrganizationsMapPage,
  DirectionPage,
  AllHobbiesPage,
} from '../features';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/disciplines/:id',
    component: OneDicsiplinePage,
  },
  {
    path: '/directions/:id/disciplines',
    component: AllDisciplinesPage,
  },
  {
    path: '/directions/:id/organizations/map',
    component: AllOrganizationsMapPage,
  },
  {
    path: '/directions/:id/organizations',
    component: AllOrganizationsPage,
  },
  {
    path: '/directions/:id/hobbies',
    component: AllHobbiesPage,
  },
  {
    path: '/directions/:id',
    component: DirectionPage,
  },
  {
    path: '/organizations/:id',
    component: OrganizationPage,
  },
  {
    path: '/ocmap',
    component: MapPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
