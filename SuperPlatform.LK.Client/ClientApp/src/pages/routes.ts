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
  SignedPage,
  SignPage,
  ChildPage,
  SignedSectionPage,
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
    path: '/signed/:childId/:sectionGroupId',
    component: SignedSectionPage,
  },
  {
    path: '/signed',
    component: SignedPage,
  },
  {
    path: '/sign/:sectionGroupId',
    component: SignPage,
  },
  {
    path: '/child/:id',
    component: ChildPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
