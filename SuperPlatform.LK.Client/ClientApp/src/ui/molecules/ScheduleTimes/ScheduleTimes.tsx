import React, { FC } from 'react';
import s from './ScheduleTimes.module.scss';
import { WEEK_DAYS_LONG } from '../../../components/model';
import { Input } from '../../atoms';

interface Props {
  dayOfWeek: number;
  schedules: {
    id: number;
    startTime: string;
    endTime: string;
  }[];
}

export const ScheduleTimes: FC<Props> = ({ dayOfWeek, schedules }) => {
  return (
    <div className={s.root}>
      <Input disabled value={WEEK_DAYS_LONG[dayOfWeek]} />
      <div className={s.schedules}>
        {schedules.map(({ id, startTime, endTime }) => (
          <div key={id}>
            <Input disabled value={startTime} />
            —
            <Input disabled value={endTime} />
          </div>
        ))}
      </div>
    </div>
  );
};
