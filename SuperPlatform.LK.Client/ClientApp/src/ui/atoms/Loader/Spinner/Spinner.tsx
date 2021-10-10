import React, { FC } from 'react';

import s from './Spinner.module.scss';

export const Spinner: FC = () => (
  <div className={s.wrap}>
    <div className={s.spinner}>
      <div>
        <div />
      </div>
    </div>
  </div>
);
