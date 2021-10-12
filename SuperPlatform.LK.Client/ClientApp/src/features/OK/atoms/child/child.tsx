import React, { FC } from 'react';
import s from './child.module.scss';
import { IChild } from '../../model';
import { Avatar, Typography } from '../../../../ui';

interface Props extends IChild {
  bottomText?: string;
}

export const Child: FC<Props> = ({ avatar, fullName, bottomText }) => {
  return (
    <div className={s.root}>
      <Avatar variant="S" src={avatar} />
      <div className={s.content}>
        <Typography variant="body2">{fullName}</Typography>
        {bottomText && (
          <Typography variant="h5" color="secondary">
            13 лет
          </Typography>
        )}
      </div>
    </div>
  );
};
