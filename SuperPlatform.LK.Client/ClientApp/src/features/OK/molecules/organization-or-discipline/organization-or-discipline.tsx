import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { ReactComponent as LocationIcon } from '../../../../assets/images/location-icon.svg';
import { formatStringToPhoneLink } from '../../../../libs';
import { Button } from '../../../../ui';
import { AgePreview, MetroStation } from '../../atoms';
import { YMPhoneClick } from '../../model';
import { ScheduleSlider } from '../schedule-slider';

import s from './organization-or-discipline.module.scss';

interface IOrganizationOrDiscipline {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  address: string;
  station: string;
  schedules: any[];
  latitude: number;
  longitude: number;
  phone: string;
  organizationPage?: boolean;
  organization_name?: string;
  discipline_name?: string;
  hobby_name?: string;
  pushState?: any;
}

export const OrganizationOrDiscipline: React.FC<IOrganizationOrDiscipline> = ({
  name,
  address,
  station,
  ageMin,
  ageMax,
  schedules,
  phone,
  organizationPage,
  latitude,
  longitude,
  organization_name,
  discipline_name,
  hobby_name,
  pushState,
}) => (
  <div className={s.item}>
    <div className={s.row}>
      <div className={s.title}>
        {hobby_name && <div>{hobby_name}</div>}
        <div className={cn({ [s.organization]: hobby_name })}>{name}</div>
        {!organizationPage && (
          <>
            <div className={s.address}>
              <div>{address}</div>
            </div>
          </>
        )}
      </div>
      <div className={s.controls}>
        {(ageMin || ageMax) && <AgePreview ageMin={ageMin} ageMax={ageMax} />}
        {latitude && longitude && !organizationPage && (
          <Link
            to={{
              pathname: '/ocmap',
              search: `?${latitude}&${longitude}`,
              state: pushState,
            }}
          >
            <Button
              variant="link"
              className={s.button}
              onClick={() => {}}
              icon={<LocationIcon />}
            >
              На карте
            </Button>
          </Link>
        )}
      </div>
    </div>
    {station && <MetroStation>{station}</MetroStation>}
    {!!schedules?.length && (
      <div className={s.schedule}>
        <ScheduleSlider
          array={schedules}
          phone={phone}
          city="Альметьевск"
          discipline_name={discipline_name}
          organization_name={organization_name}
        />
      </div>
    )}
    {!organizationPage && (
      <a
        href={`tel:${formatStringToPhoneLink(phone)}`}
        onClick={() =>
          YMPhoneClick({
            phone_number: phone,
            discipline: discipline_name,
            city: 'Альметьевск',
            company_name: organization_name,
          })
        }
      >
        <Button style={{ marginTop: '1rem' }}>Записаться</Button>
      </a>
    )}
  </div>
);
