import { Home } from './home';
import { Error404Page } from './error404';
import {
  MapPage,
  SignedPage,
  SignPage,
  ChildPage,
  SignedSectionPage,
  DirectionPage,
} from '../components';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/directions/:id',
    component: DirectionPage,
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
