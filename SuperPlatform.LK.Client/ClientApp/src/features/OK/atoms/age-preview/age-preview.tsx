import React from 'react';
import { declensionOfNumber } from '../../../../libs';

import s from './age-preview.module.scss';

interface IAgePreview {
  ageMin: number;
  ageMax: number;
  [x: string]: any;
}

const titles = ['года', 'лет', 'лет'];

export const AgePreview: React.FC<IAgePreview> = ({
  ageMin,
  ageMax,
  ...rest
}) => {
  const renderAge = (): string => {
    let from = 'От';
    let to = 'до';

    if (ageMin !== null) {
      from += ` ${ageMin} `;

      if (ageMax === null) {
        from += ` ${declensionOfNumber(ageMin, titles)} `;
        to = '';
      }
    }

    if (ageMax !== null) {
      if (ageMin === null) {
        from = '';
        to = 'До';
      }
      to += ` ${ageMax} ${declensionOfNumber(ageMax, titles)}`;
    }

    return from + to;
  };

  return (
    <div className={s.wrap} {...rest}>
      {renderAge()}
    </div>
  );
};
