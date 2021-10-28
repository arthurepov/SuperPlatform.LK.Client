import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import uuid from 'uuid/dist/v4';
import s from './schedule-slider.module.scss';
import { WEEK_DAYS_SHORT_NAME } from '../../model';
import { ScrollableList } from '../../../../ui';

interface IScheduleSlider {
  array: {
    dayOfWeek: number;
    id: number;
    timeStart: string;
    timeEnd: string;
  }[];
  phone?: string;
  city?: string;
  organization_name?: string;
  discipline_name?: string;
}

const ONE_WEEK = 7;

export const ScheduleSlider: React.FC<IScheduleSlider> = memo(({ array }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(
      Array.from(new Array(ONE_WEEK))
        .map((_, index) =>
          array?.[index]
            ? array[index]
            : {
                dayOfWeek: 10,
                timeStart: null,
                timeEnd: null,
                id: uuid(),
              }
        )
        .sort((a, b) => (a.dayOfWeek > b.dayOfWeek ? 1 : -1))
    );
  }, []);

  return (
    <ScrollableList>
      {data?.map(({ timeStart, timeEnd, id }, index) => (
        <div
          className={cn(s.item, {
            [s.inactive]: !timeStart || !timeEnd,
          })}
          key={id}
        >
          <div className={s.item_name}>{WEEK_DAYS_SHORT_NAME[index]}</div>
          <div className={s.item_wrap}>
            <div>{timeStart}</div>
            <div>{timeStart && '–'}</div>
            <div>{timeEnd}</div>
          </div>
        </div>
      ))}
    </ScrollableList>
  );
});
