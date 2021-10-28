import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ScrollableList } from '../../../../ui';
import { MetroStation } from '../../atoms';
import s from './organization-slider.module.scss';

interface IOrganizationSlider {
  array: any[];
  pushState: {
    title: string;
    path: string;
  };
  onClick?: () => void;
}

export const OrganizationSlider: React.FC<IOrganizationSlider> = ({
  onClick,
  array,
  pushState,
}) => {
  return (
    <>
      <div className={s.header}>
        <h2>Организации</h2>
        {onClick && (
          <Button onClick={onClick} variant="link">
            Смотреть все
          </Button>
        )}
      </div>
      <ScrollableList>
        {array.map(({ id, name, address, station }) => (
          <Link
            to={{
              pathname: `/organizations/${id}`,
              state: pushState,
            }}
            className={s.item}
            key={id}
          >
            <div>
              <div className={s.title}>{name}</div>
              <div className={s.address}>{address}</div>
              {station && (
                <MetroStation style={{ marginTop: 'auto' }}>
                  {station}
                </MetroStation>
              )}
            </div>
          </Link>
        ))}
      </ScrollableList>
    </>
  );
};
