import React from 'react';

import { declensionOfNumber } from '../../../libs';

import s from './organization-count.module.scss';

const titles = ['организация', 'организации', 'организаций'];

interface IOrganizationCount {
  count: number;
}

export const OrganizationCount: React.FC<IOrganizationCount> = ({ count }) => (
  <div className={s.wrap}>
    {`${count} ${declensionOfNumber(count, titles)}`}
  </div>
);
