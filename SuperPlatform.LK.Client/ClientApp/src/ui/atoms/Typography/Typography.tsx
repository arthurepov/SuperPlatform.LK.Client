import React, { FC } from 'react';
import cn from 'classnames';
import s from './Typography.module.scss';

const variantsMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subheading1: 'h6',
  subheading2: 'h6',
  body1: 'p',
  body2: 'p',
} as const;

type VariantKeys = keyof typeof variantsMapping;

export type Color =
  | 'primary'
  | 'secondary'
  | 'link'
  | 'yellow'
  | 'error'
  | 'white';

interface TypographyProps {
  component?: typeof variantsMapping[VariantKeys] | 'div';
  className?: string;
  variant?: VariantKeys;
  color?: Color;
  bold?: boolean;
  uppercase?: boolean;
  capitalize?: boolean;
}

export const Typography: FC<TypographyProps> = ({
  component,
  variant = 'body1',
  color = 'primary',
  children,
  className,
  bold,
  uppercase = false,
  capitalize = false,
  ...props
}) => {
  const Component: any =
    component ?? variantsMapping[variant] ?? variantsMapping.body1;

  return (
    <Component
      className={cn(s.typography, {
        [s[`typography--variant-${variant}`]]: variant,
        [s[`typography--color-${color}`]]: color,
        [s[`typography--bold`]]: bold,
        [s[`typography--uppercase`]]: uppercase,
        [s[`typography--capitalize`]]: capitalize,
        [className as string]: className,
      })}
      {...props}
    >
      {children}
    </Component>
  );
};
