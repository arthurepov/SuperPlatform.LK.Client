import { EffectState } from 'patronum/status';
import ym from 'react-yandex-metrika';

import { IYMPhoneClick } from '../../../libs';

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

export const renderAge = (ageMin: number, ageMax: number): string =>
  `${ageMin && `От ${ageMin}`} ${ageMax && `до ${ageMax}`}`;

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
