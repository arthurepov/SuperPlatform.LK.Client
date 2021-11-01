import React from 'react';
import cn from 'classnames';
import { renderAge } from '../../model';
import s from './age-preview.module.scss';

interface IAgePreview {
  ageMin: number;
  ageMax: number;
  [x: string]: any;
}

export const AgePreview: React.FC<IAgePreview> = ({
  ageMin,
  ageMax,
  className,
  ...rest
}) => {
  const text = renderAge(ageMin, ageMax);

  if (!text) {
    return null;
  }

  return (
    <div className={cn(s.wrap, className)} {...rest}>
      {text}
    </div>
  );
};
