const SORT_BY_ID = '_sort=id';
const NO_LIMIT = '_limit=-1';

export const OK_HOST_URL = 'https://edu.obrkarta.ru:1337';
export const OK_ORGANIZATIONS_URL = `/organizations?${SORT_BY_ID}&${NO_LIMIT}`;
export const OK_DISCIPLINES_URL = `/disciplines?${SORT_BY_ID}&${NO_LIMIT}`;
export const OK_SCHEDULES_URL = `/schedules?${SORT_BY_ID}&${NO_LIMIT}`;
export const OK_DIRECTIONS_URL = `/directions?${SORT_BY_ID}&${NO_LIMIT}`;
export const OK_CITIES_URL = `/cities?${SORT_BY_ID}&${NO_LIMIT}`;
