import React, { FC, useState } from 'react';
import cn from 'classnames';
import sortBy from 'lodash/sortBy';
import s from './section-groups.module.scss';
import { IOrganizationSection, WEEK_DAYS_SHORT } from '../../model';
import { Typography } from '../../../ui';

interface Props extends IOrganizationSection {
  onChange?: (sectionGroupId: number) => void;
}

export const SectionGroups: FC<Props> = ({ name, sectionGroups, onChange }) => {
  const [activeGroup, setActiveGroup] = useState(sectionGroups?.[0]?.id);
  const activeGroupObj = sectionGroups?.find(
    ({ id: groupId }) => activeGroup === groupId
  );

  const onGroupChange = (id: number): void => {
    setActiveGroup(id);

    if (onChange) {
      onChange(id);
    }
  };

  const sortedSchedules =
    sortBy(activeGroupObj?.sectionGroupSchedules ?? [], 'dayOfWeek') ?? [];

  return (
    <div className={s.root}>
      <Typography variant="body2" bold>
        {name}
      </Typography>
      <div className={s.groups}>
        <div className={s.buttons}>
          {sectionGroups?.map(({ id: groupId, name: groupName }) => (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onGroupChange(groupId)}
              key={groupId}
              className={cn(s.button, {
                [s.button_active]: groupId === activeGroup,
              })}
            >
              {groupName}
            </div>
          ))}
        </div>
        <div className={s.schedules}>
          {sortedSchedules?.map(
            ({ id: scheduleId, dayOfWeek, sectionGroupScheduleTimes }) => (
              <div key={scheduleId}>
                <Typography className={s.schedule_title}>
                  {WEEK_DAYS_SHORT[dayOfWeek]}
                </Typography>
                {sectionGroupScheduleTimes?.map(
                  ({ id: timeId, startTime, endTime }) => (
                    <div key={timeId} className={s.schedule}>
                      <Typography variant="h6">{startTime}</Typography>
                      <Typography variant="h6">–</Typography>
                      <Typography variant="h6">{endTime}</Typography>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
