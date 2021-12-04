import React, { memo } from 'react';
import cn from 'classnames';

import s from './Avatar.module.scss';

enum Variant {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

type VariantType = 'XS' | 'S' | 'M' | 'L' | 'XL';

interface AvatarProps {
  className?: string;
  variant?: VariantType;
  src?: string;
  alt?: string;
}

export const Avatar = memo<AvatarProps>(
  ({ variant = Variant.M, src, alt, className, ...props }) => {
    const avatarClassName = cn(s.avatar, {
      [s.extraSmall]: variant === Variant.XS,
      [s.small]: variant === Variant.S,
      [s.medium]: variant === Variant.M,
      [s.large]: variant === Variant.L,
      [s.extraLarge]: variant === Variant.XL,
      [className as string]: className as string,
    });

    if (!src) {
      return (
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={avatarClassName}
        >
          <circle cx="80" cy="80" r="80" fill="#EEEEEE" />
          <g opacity="0.3">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              // eslint-disable-next-line max-len
              d="M86.1837 80C86.1837 91.0457 77.4121 100 66.5918 100C55.7716 100 47 91.0457 47 80C47 68.9543 55.7716 60 66.5918 60C77.4121 60 86.1837 68.9543 86.1837 80ZM75.1136 80C75.1136 84.6715 71.2983 88.4585 66.5919 88.4585C61.8855 88.4585 58.0703 84.6715 58.0703 80C58.0703 75.3285 61.8855 71.5415 66.5919 71.5415C71.2983 71.5415 75.1136 75.3285 75.1136 80ZM88.2244 80.2041L99.857 62.8571H112.306L100.469 80.2041L112.306 97.1429H99.857L88.2244 80.2041Z"
              fill="#9E9E9E"
            />
          </g>
        </svg>
      );
    }

    return <img src={src} className={avatarClassName} {...props} alt={alt} />;
  }
);
