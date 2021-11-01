import React, { FC } from 'react';
import cn from 'classnames';
import { Typography } from '../../../ui';
import { ReactComponent as Arrow } from './arrow.svg';
import s from './text-block.module.scss';

interface Props {
  topText: string | string[];
  bottomText: string;
  withDivider?: boolean;
  withArrow?: boolean;
  onClick?: () => void;
}

export const TextBlock: FC<Props> = ({
  topText,
  bottomText,
  withDivider = false,
  onClick,
  withArrow = !!onClick,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(s.root, {
        [s.withDivider]: withDivider,
      })}
      onClick={onClick}
    >
      {typeof topText === 'string' ? (
        <Typography variant="body2">{topText}</Typography>
      ) : (
        topText.map((text) => (
          <Typography key={text} variant="body2">
            {text}
          </Typography>
        ))
      )}
      <Typography color="secondary" variant="h5">
        {bottomText}
      </Typography>
      {withArrow && <Arrow className={s.arrow} />}
    </div>
  );
};
