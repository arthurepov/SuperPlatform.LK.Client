import React, { FC } from 'react';
import s from './scrollable-list.module.scss';

export const ScrollableList: FC = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
