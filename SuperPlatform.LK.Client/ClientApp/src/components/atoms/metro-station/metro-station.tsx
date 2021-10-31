import React from 'react';

import s from './metro-station.module.scss';

interface IMetroStation {
  children: string;
  [x: string]: any;
}

export const MetroStation: React.FC<IMetroStation> = ({
  children,
  ...rest
}) => (
  <div className={s.wrap} {...rest}>
    {children}
  </div>
);
