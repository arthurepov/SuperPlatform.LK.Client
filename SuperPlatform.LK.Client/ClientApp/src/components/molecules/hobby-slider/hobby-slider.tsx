import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ScrollableList } from '../../../ui';
import s from './hobby-slider.module.scss';

interface IHobbySlider {
  array: {
    name: string;
    address: string;
    organizationName: string;
    disciplineId: number;
  }[];
  pushState: {
    title: string;
    path: string;
  };
  onClick?: () => void;
}

export const HobbySlider: React.FC<IHobbySlider> = ({
  onClick,
  array,
  pushState,
}) => {
  return (
    <>
      <div className={s.header}>
        <h2>Кружки и секции</h2>
        {onClick && (
          <Button onClick={onClick} variant="link">
            Смотреть все
          </Button>
        )}
      </div>
      <ScrollableList>
        {array.map(({ name, address, organizationName, disciplineId }) => (
          <Link
            to={{
              pathname: `/disciplines/${disciplineId}`,
              state: pushState,
            }}
            className={s.item}
            key={name + address}
          >
            <div>
              <div className={s.title}>{name}</div>
              <div className={s.address}>{address}</div>
              <div className={s.organizationName}>{organizationName}</div>
            </div>
          </Link>
        ))}
      </ScrollableList>
    </>
  );
};
