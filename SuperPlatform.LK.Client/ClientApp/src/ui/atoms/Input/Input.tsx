import React, { AllHTMLAttributes, FC } from 'react';
// @ts-ignore
import InputMask from 'react-input-mask';
import cn from 'classnames';

import s from './Input.module.scss';

interface IInput extends AllHTMLAttributes<HTMLInputElement> {
  variant?: 'outlined' | 'standart';
  fullWidth?: boolean;
  error?: boolean;
  mask?: string;
}

export const Input: FC<IInput> = ({
  variant = 'outlined',
  className,
  fullWidth,
  error,
  mask,
  ...rest
}) => {
  if (mask) {
    return (
      <InputMask mask={mask} {...rest}>
        {(inputProps: any) => (
          <input
            className={cn(s.root, [className], {
              [s.root_fullWidth]: fullWidth,
              [s.root_standart]: variant === 'standart',
              [s.root_error]: error,
            })}
            type="text"
            {...inputProps}
          />
        )}
      </InputMask>
    );
  }

  return (
    <input
      className={cn(s.root, [className], {
        [s.root_fullWidth]: fullWidth,
        [s.root_standart]: variant === 'standart',
        [s.root_error]: error,
      })}
      type="text"
      {...rest}
    />
  );
};
