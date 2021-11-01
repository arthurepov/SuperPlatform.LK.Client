import { EffectState } from 'patronum/status';
import ym from 'react-yandex-metrika';

import { declensionOfNumber, IYMPhoneClick } from '../../libs';

export const isValidAge = (age = 0, min: number, max: number): boolean => {
  if (age !== 0) {
    if (min && max) {
      return age >= min && age <= max;
    }

    if (min) {
      return age >= min;
    }

    if (max) {
      return age <= max;
    }
  }

  return true;
};

const AGE_TITLES = ['года', 'лет', 'лет'];

export const renderAge = (ageMin?: number, ageMax?: number): string | null => {
  if (ageMax && ageMin && ageMin !== 0 && ageMax !== 0) {
    return `${ageMin && `От ${ageMin}`} ${
      ageMax && `до ${ageMax} ${declensionOfNumber(ageMax, AGE_TITLES)}`
    }`;
  }

  if (ageMax && ageMax !== 0) {
    return `До ${ageMax} ${declensionOfNumber(ageMax, AGE_TITLES)}`;
  }

  if (ageMin && ageMin !== 0) {
    return `До ${ageMin} ${declensionOfNumber(ageMin, AGE_TITLES)}`;
  }

  return null;
};

export const YMPhoneClick = ({
  phone_number,
  discipline,
  city,
  company_name,
}: IYMPhoneClick): void => {
  ym('reachGoal', 'phoneClick', {
    phone_number,
    discipline,
    city,
    company_name,
  });
};

export const isPendingEffect = (status: EffectState): boolean =>
  status === 'pending';

export const saveSelectedCityToStorage = (selectedCityId: number): void =>
  window.localStorage.setItem('selectedCityId', selectedCityId.toString());
export const getSelectedCityFromStorage = (): number =>
  Number(window.localStorage.getItem('selectedCityId')) ?? null;

export const RECORD_TYPES = ['Индивидуальная', 'Групповая'];
export const PEREODICITY_TYPES = ['Месяц', 'Неделя', 'Год'];
export const WEEK_DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const WEEK_DAYS_LONG = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

export const arrayFilteringFunc = (array = [], query = ''): any[] => {
  if (query?.length >= 1) {
    return array?.filter((obj) => {
      return Object.values(obj).some((val) => {
        return val?.toString()?.toLowerCase()?.includes(query?.toLowerCase());
      });
    });
  }

  return array;
};
