import React, { FC } from 'react';
import s from './child.module.scss';
import { IChild } from '../../model';
import { Avatar, Typography } from '../../../../ui';
import { ReactComponent as Arrow } from './arrow.svg';

interface Props extends IChild {
  bottomText?: string;
  onClick?: () => void;
  withArrow?: boolean;
}

export const Child: FC<Props> = ({
  avatar,
  fullName,
  bottomText,
  onClick,
  withArrow = !!onClick,
}) => {
  return (
    <div role="button" tabIndex={0} className={s.root} onClick={onClick}>
      <Avatar variant="S" src={avatar} />
      <div className={s.content}>
        <Typography variant="body2">{fullName}</Typography>
        {bottomText && (
          <Typography variant="h5" color="secondary">
            {bottomText}
          </Typography>
        )}
      </div>
      {withArrow && <Arrow className={s.arrow} />}
    </div>
  );
};
