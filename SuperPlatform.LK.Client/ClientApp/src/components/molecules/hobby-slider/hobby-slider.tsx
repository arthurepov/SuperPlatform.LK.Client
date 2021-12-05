import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ScrollableList } from '../../../ui';
import s from './hobby-slider.module.scss';
import { ISection } from '../../model';

interface Props {
  array: ISection[];
  pushState: {
    title: string;
    path: string;
  };
  onClick?: () => void;
}

export const HobbySlider: React.FC<Props> = ({ onClick, array, pushState }) => {
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
        {array?.map(
          ({
            name,
            sectionName,
            id,
            organizationName,
            address,
            organizationAdress,
          }) => (
            <Link
              to={{
                pathname: `/section/${id}`,
                state: pushState,
              }}
              className={s.item}
              key={id}
            >
              <div>
                <div className={s.title}>{sectionName ?? name}</div>
                {(address || organizationAdress) && (
                  <div className={s.address}>
                    {address ?? organizationAdress}
                  </div>
                )}
                {organizationName && (
                  <div className={s.organizationName}>{organizationName}</div>
                )}
              </div>
            </Link>
          )
        )}
      </ScrollableList>
    </>
  );
};
