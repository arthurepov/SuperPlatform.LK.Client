import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'effector-react';
import cn from 'classnames';
import s from './SectionInfo.module.scss';
import {
  $children,
  ISection,
  PEREODICITY_TYPES,
  RECORD_TYPES,
} from '../../model';
import { Button, Typography } from '../../../ui';
import { ReactComponent as LocationIcon } from '../../../assets/images/location-icon.svg';
import { AgePreview } from '../../atoms';
import { SectionGroups } from '../section-groups';

interface Props extends ISection {
  pushState?: any;
  className?: string;
}

export const SectionInfo: FC<Props> = ({
  name,
  sectionName,
  organizationName,
  organizationAdress,
  address,
  latitude,
  longitude,
  pushState,
  minAge,
  maxAge,
  recordType,
  cost,
  costDuration,
  sectionGroups,
  className,
}) => {
  const children = useStore($children);
  const [activeGroup, setActiveGroup] = useState(sectionGroups?.[0]?.id);

  return (
    <div className={cn(s.root, className)}>
      <div className={s.header}>
        <Typography className={s.name} bold>
          {sectionName ?? name}
        </Typography>
        {(minAge !== undefined || maxAge !== undefined) && (
          <AgePreview className={s.age} ageMin={minAge} ageMax={maxAge} />
        )}
      </div>
      {organizationName && (
        <div className={s.organization}>
          <div>
            <Typography variant="h5" bold color="secondary">
              {organizationName}
            </Typography>
            {latitude !== undefined && longitude !== undefined && (
              <Link
                className={s.organization_button}
                to={{
                  pathname: '/ocmap',
                  search: `?${latitude}&${longitude}`,
                  state: pushState,
                }}
              >
                <Button variant="link" icon={<LocationIcon />}>
                  На карте
                </Button>
              </Link>
            )}
          </div>
          {(organizationAdress || address) && (
            <Typography color="secondary" variant="h5">
              {organizationAdress ?? address}
            </Typography>
          )}
        </div>
      )}
      {recordType !== undefined &&
        cost !== undefined &&
        costDuration !== undefined && (
          <div className={s.record}>
            <Typography
              className={s.record_title}
              variant="h5"
              color="secondary"
            >
              {RECORD_TYPES[recordType]}
            </Typography>
            <Typography
              variant="h5"
              bold
            >{`Стоимость – ${cost} ₽/${PEREODICITY_TYPES[costDuration]}`}</Typography>
          </div>
        )}
      {sectionGroups?.length > 0 && (
        <div className={s.groups}>
          <SectionGroups
            id={1}
            name=""
            sectionGroups={sectionGroups}
            onChange={setActiveGroup}
          />
        </div>
      )}
      {children?.length > 0 && (
        <Link className={s.sign} to={`/sign/${activeGroup}`}>
          <Button isWide>Записаться</Button>
        </Link>
      )}
    </div>
  );
};
