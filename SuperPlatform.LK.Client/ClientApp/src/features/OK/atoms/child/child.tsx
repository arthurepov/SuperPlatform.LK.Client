import React, { FC } from 'react';
import s from './child.module.scss';
import { IChild } from '../../model';
import { Avatar, Typography } from '../../../../ui';

export const Child: FC<IChild> = ({ avatar, fullName }) => {
  return (
    <div className={s.root}>
      <Avatar variant="S" src={avatar} />
      <div className={s.content}>
        <Typography variant="body2">{fullName}</Typography>
        <Typography variant="h5" color="secondary">
          13 лет
        </Typography>
      </div>
    </div>
  );
};
