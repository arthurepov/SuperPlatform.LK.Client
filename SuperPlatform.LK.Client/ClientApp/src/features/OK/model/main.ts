import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  sample,
} from 'effector';
import { status } from 'patronum';
import { EffectState } from 'patronum/status';
import {
  CHILDREN_URL,
  OK_CITIES_URL,
  OK_DIRECTIONS_URL,
  OK_DISCIPLINES_URL,
  OK_HOST_URL,
  OK_ORGANIZATIONS_URL,
  OK_SCHEDULES_URL,
} from './api';

import {
  getSelectedCityFromStorage,
  isPendingEffect,
  saveSelectedCityToStorage,
} from './helpers';
import { IChild } from './types';

// Events
export const getDirections = createEvent();
export const getDisciplines = createEvent();
export const getOrganizations = createEvent();
export const getSchedules = createEvent();
export const getCities = createEvent();
export const getAllFromOCard = createEvent();
export const selectCity = createEvent<number>();
export const getChildren = createEvent();

// Effects
export const getDirectionsFx = createEffect(async () => {
  const res = await fetch(OK_HOST_URL + OK_DIRECTIONS_URL);

  return res.json();
});

export const getDisciplinesFx = createEffect(async () => {
  const res = await fetch(OK_HOST_URL + OK_DISCIPLINES_URL);

  return res.json();
});

export const getOrganizationsFx = createEffect(async (cityQuery = '') => {
  const res = await fetch(OK_HOST_URL + OK_ORGANIZATIONS_URL + cityQuery);

  return res.json();
});

export const getSchedulesFx = createEffect(async (cityQuery = '') => {
  const res = await fetch(OK_HOST_URL + OK_SCHEDULES_URL + cityQuery);

  return res.json();
});

export const getCitiesFx = createEffect(async () => {
  const res = await fetch(OK_HOST_URL + OK_CITIES_URL);

  return res.json();
});

export const getChildrenFx = createEffect(async () => {
  const res = await fetch(CHILDREN_URL);

  return res.json();
});

// Stores
export const $directions = createStore({
  data: null,
  error: null,
});
export const $disciplines = createStore({
  data: null,
  error: null,
});
export const $organizations = createStore({
  data: null,
  error: null,
});
export const $schedules = createStore({
  data: null,
  error: null,
});
export const $cities = createStore({
  data: [],
  error: null,
});
export const $hobbies = createStore({
  data: [],
  error: null,
});
export const $children = createStore<{
  data: IChild[];
  error: string | null;
}>({
  data: [],
  error: null,
});

const $directionsStatus = status({
  effect: getDisciplinesFx,
  defaultValue: 'pending',
});
const $disciplinesStatus = status({
  effect: getDisciplinesFx,
  defaultValue: 'pending',
});
const $organizationsStatus = status({
  effect: getOrganizationsFx,
  defaultValue: 'pending',
});
const $schedulesStatus = status({
  effect: getSchedulesFx,
  defaultValue: 'pending',
});
const $citiesStatus = status({ effect: getCitiesFx, defaultValue: 'pending' });
const $childrenStatus = status({
  effect: getChildrenFx,
  defaultValue: 'pending',
});

export const $selectedCity = createStore<number | null>(null);

export const $OCardStore = combine<any>(
  $directions,
  $disciplines,
  $organizations,
  $schedules,
  $hobbies,
  $cities,
  $selectedCity,
  $children,
  $directionsStatus,
  $disciplinesStatus,
  $organizationsStatus,
  $schedulesStatus,
  $citiesStatus,
  $childrenStatus,
  (
    directions,
    disciplines,
    organizations,
    schedules,
    hobbies,
    cities,
    selectedCity,
    children,
    getDirectionsFxStatus,
    getDisciplinesFxStatus,
    getOrganizationsFxStatus,
    getSchedulesFxStatus,
    getCitiesFxStatus,
    getChildrenFxStatus
  ) => ({
    directions,
    disciplines: {
      ...disciplines,
      data:
        disciplines.data
          ?.filter(({ name, id }) => name !== null && id !== null)
          ?.filter(({ id }) => {
            const organizationIds = [
              ...new Set(
                schedules?.data?.map(({ disciplineId }) => disciplineId)
              ),
            ];

            return organizationIds.includes(id);
          })
          .map((discipline) => {
            const disciplineSchedules =
              schedules.data?.filter(
                ({ disciplineId }) => disciplineId === discipline.id
              ) ?? [];
            const disciplineOrganizations =
              disciplineSchedules.map(({ organizationId }) => organizationId) ??
              [];

            return {
              ...discipline,
              organizationsCount: [...new Set(disciplineOrganizations)]?.length,
              organizationsIds: [...new Set(disciplineOrganizations)],
            };
          }) ?? null,
    },
    organizations: {
      ...organizations,
      data:
        organizations.data?.filter(
          ({ name, id }) => name !== null && id !== null
        ) ?? null,
    },
    schedules,
    hobbies: {
      ...hobbies,
      data: [
        ...new Set(
          schedules?.data?.map(
            ({ name, organizationId, address, disciplineId, cityId }) =>
              JSON.stringify({
                name,
                organizationId,
                address,
                disciplineId,
                cityId,
              })
          )
        ),
      ].map((hobby: string) => {
        const data = JSON.parse(hobby);
        const organization = organizations?.data?.find(
          ({ id }) => id === data?.organizationId
        );

        return {
          ...data,
          organizationName: organization?.name ?? '',
        };
      }),
    },
    cities,
    selectedCity,
    children,
    loading: [
      getDirectionsFxStatus,
      getDisciplinesFxStatus,
      getOrganizationsFxStatus,
      getSchedulesFxStatus,
      getCitiesFxStatus,
      getChildrenFxStatus,
    ].some((effectStatus: EffectState) => isPendingEffect(effectStatus)),
  })
);

// Logic

forward({
  from: getDisciplines,
  to: getDisciplinesFx,
});

forward({
  from: getDirections,
  to: getDirectionsFx,
});

forward({
  from: getOrganizations,
  to: getOrganizationsFx,
});

forward({
  from: getSchedules,
  to: getSchedulesFx,
});

forward({
  from: getCities,
  to: getCitiesFx,
});

forward({
  from: getChildren,
  to: getChildrenFx,
});

forward({
  from: getAllFromOCard,
  to: [getDirectionsFx, getCitiesFx, getDisciplinesFx, getChildrenFx],
});

sample({
  source: $selectedCity,
  fn: (id: number): string => `&cityId=${id}`,
  target: [getSchedulesFx, getOrganizationsFx, getDisciplinesFx],
});

$directions
  .on(getDirectionsFx.doneData, (_, data) => ({ data, error: null }))
  .on(getDirectionsFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));

$disciplines
  .on(getDisciplinesFx.doneData, (_, data) => ({ data, error: null }))
  .on(getDisciplinesFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));

$organizations
  .on(getOrganizationsFx.doneData, (_, data) => ({ data, error: null }))
  .on(getOrganizationsFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));

$schedules
  .on(getSchedulesFx.doneData, (_, data) => ({ data, error: null }))
  .on(getSchedulesFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));

$cities
  .on(getCitiesFx.doneData, (_, data) => ({ data, error: null }))
  .on(getCitiesFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));

$selectedCity
  .on(selectCity, (_, newCityId) => {
    saveSelectedCityToStorage(newCityId);

    return newCityId;
  })
  .on(getCitiesFx.doneData, (_, data) => {
    const persisted = getSelectedCityFromStorage();

    if (!persisted) {
      const firstId = data?.[0]?.id;

      saveSelectedCityToStorage(firstId);

      return firstId;
    }

    return persisted;
  });

$children
  .on(getChildrenFx.doneData, (_, data) => ({ data, error: null }))
  .on(getChildrenFx.failData, ({ data }, { message }) => ({
    data,
    error: message,
  }));
