import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  sample,
} from 'effector';
import { status } from 'patronum';
import {
  IChild,
  ICity,
  IDirection,
  IDiscipline,
  IOrganization,
  ISection,
} from './types';
import {
  CHILDREN_URL,
  CITIES_URL,
  DIRECTIONS_URL,
  HOST_URL,
  ORGANIZATIONS_URL,
} from './api';
import { isPendingEffect } from './helpers';

const persistedCityId = localStorage.getItem('cityId');

export const $children = createStore<IChild[]>([]);
export const $directions = createStore<IDirection[]>([]);
export const $cities = createStore<ICity[]>([]);
export const $activeCity = createStore<number>(Number(persistedCityId) || 1);
export const $organizations = createStore([]);
export const $disciplines = createStore([]);
export const $sections = createStore([]);

export const getData = createEvent();
export const setDisciplines =
  createEvent<{ direction: number; disciplines: IDiscipline[] }>();
export const setCity = createEvent<number>();
export const setOrganization =
  createEvent<{ direction: number; organizations: IOrganization[] }>();
export const resetDisciplines = createEvent();
export const resetSections = createEvent();
export const resetOrganizations = createEvent();
export const setSections =
  createEvent<{ direction: number; sections: ISection[] }>();

export const getChildrenFx = createEffect(async () => {
  const data = await fetch(HOST_URL + CHILDREN_URL);

  return data.json();
});
export const getDirectionsFx = createEffect(
  async (cityId = $activeCity.getState()) => {
    const data = await fetch(`${HOST_URL}${DIRECTIONS_URL}?cityId=${cityId}`);

    return data.json();
  }
);
export const getCitiesFx = createEffect(async () => {
  const data = await fetch(HOST_URL + CITIES_URL);

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

export const $global = combine(
  $children,
  $directions,
  $cities,
  $activeCity,
  $organizations,
  $disciplines,
  $sections,
  $getChildrenFxStatus,
  $getDirectionsFxStatus,
  $getCitiesFxStatus,
  (
    children,
    directions,
    cities,
    activeCity,
    organizations,
    disciplines,
    sections,
    childrenStatus,
    directionStatus,
    citiesStatus
  ) => ({
    children,
    directions,
    cities,
    activeCity,
    organizations,
    disciplines,
    sections,
    loading: [childrenStatus, directionStatus, citiesStatus].some(
      isPendingEffect
    ),
  })
);

forward({
  from: getData,
  to: [getChildrenFx, getCitiesFx, getDirectionsFx],
});

sample({
  clock: $activeCity,
  fn: (cityId) => cityId,
  target: [
    getDirectionsFx,
    resetDisciplines,
    resetSections,
    resetOrganizations,
  ],
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
$sections
  .on(setSections, (state, { direction, sections }) => ({
    ...state,
    [direction]: sections,
  }))
  .reset(resetDisciplines);
$organizations
  .on(setOrganization, (state, { direction, organizations }) => ({
    ...state,
    [direction]: organizations,
  }))
  .reset(resetOrganizations);
