import React, { FC } from 'react';
import cn from 'classnames';
import { Typography } from '../../atoms';
import s from './FormItem.module.scss';

interface IFormItem extends Record<string, any> {
  label?: string;
  className?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string | false | undefined;
}

export const FormItem: FC<IFormItem> = ({
  fullWidth,
  children,
  label,
  className,
  helperText,
  error,
  ...rest
}) => {
  return (
    <div
      className={cn(s.root, [className], {
        [s.root_fullWidth]: fullWidth,
      })}
      {...rest}
    >
      {label && (
        <Typography
          color={error ? 'error' : 'secondary'}
          variant="body2"
          className={s.label}
        >
          {label}
        </Typography>
      )}
      {children}
      {helperText && (
        <Typography
          color={error ? 'error' : 'secondary'}
          variant="body2"
          className={s.helperText}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};
