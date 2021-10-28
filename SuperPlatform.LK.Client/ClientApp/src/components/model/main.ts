import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  sample,
} from 'effector';
import { status } from 'patronum';
import { IChild, ICity, IDirection, IDiscipline, IOrganization } from './types';
import {
  CHILDREN_URL,
  CITIES_URL,
  DIRECTIONS_URL,
  HOST_URL,
  ORGANIZATIONS_URL,
} from './api';
import { isPendingEffect } from './helpers';
import { CHILDREN_MOCK, DIRECTIONS_MOCK } from './mock';

const persistedCityId = localStorage.getItem('cityId');

export const getData = createEvent();
export const setDisciplines =
  createEvent<{ direction: number; disciplines: IDiscipline[] }>();
export const setCity = createEvent<number>();
export const resetDisciplines = createEvent();

export const getChildrenFx = createEffect(async () => {
  return CHILDREN_MOCK; // TODO

  const data = await fetch(HOST_URL + CHILDREN_URL);

  return data.json();
});
export const getDirectionsFx = createEffect(async (cityId = 1) => {
  return DIRECTIONS_MOCK; // TODO

  const data = await fetch(`${HOST_URL}${DIRECTIONS_URL}?cityId=${cityId}`);

  return data.json();
});
export const getCitiesFx = createEffect(async () => {
  const data = await fetch(HOST_URL + CITIES_URL);

  return data.json();
});
export const getOrganizationsFx = createEffect(async () => {
  const data = await fetch(HOST_URL + ORGANIZATIONS_URL);

  return data.json();
});

const $getCitiesFxStatus = status({
  effect: getCitiesFx,
  defaultValue: 'pending',
});
const $getDirectionsFxStatus = status({
  effect: getDirectionsFx,
  defaultValue: 'pending',
});
const $getChildrenFxStatus = status({
  effect: getChildrenFx,
  defaultValue: 'pending',
});

// TODO: пофиксить defaultValue
const $getOrganizationsFxStatus = status({
  effect: getOrganizationsFx,
  defaultValue: 'done',
});

export const $children = createStore<IChild[]>([]);
export const $directions = createStore<IDirection[]>([]);
export const $cities = createStore<ICity[]>([]);
export const $activeCity = createStore<number>(
  persistedCityId ? JSON.parse(persistedCityId) : 1
);
export const $organizations = createStore<IOrganization[]>([]);
export const $disciplines = createStore([]);
export const $global = combine(
  $children,
  $directions,
  $cities,
  $activeCity,
  $organizations,
  $disciplines,
  $getChildrenFxStatus,
  $getDirectionsFxStatus,
  $getCitiesFxStatus,
  $getOrganizationsFxStatus,
  (
    children,
    directions,
    cities,
    activeCity,
    organizations,
    disciplines,
    childrenStatus,
    directionStatus,
    citiesStatus,
    organizationsStatus
  ) => ({
    children,
    directions,
    cities,
    activeCity,
    organizations,
    disciplines,
    loading: [
      childrenStatus,
      directionStatus,
      citiesStatus,
      organizationsStatus,
    ].some(isPendingEffect),
  })
);

forward({
  from: getData,
  to: [getChildrenFx, getCitiesFx, getDirectionsFx],
});

sample({
  clock: $activeCity,
  fn: (cityId) => cityId,
  target: [getDirectionsFx, resetDisciplines],
});

$activeCity.on(setCity, (state, cityId) => {
  localStorage.setItem('cityId', JSON.stringify(cityId));

  return cityId;
});
$children.on(getChildrenFx.doneData, (state, data) => data);
$directions.on(getDirectionsFx.doneData, (state, { data }) => data);
$cities.on(getCitiesFx.doneData, (state, { data }) => data);
$disciplines
  .on(setDisciplines, (state, { direction, disciplines }) => ({
    ...state,
    [direction]: disciplines,
  }))
  .reset(resetDisciplines);
