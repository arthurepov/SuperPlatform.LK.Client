import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ScrollableList } from '../../../ui';
import s from './slider-list.module.scss';
import scienceUrl from '../../../assets/images/science.png';
import { HOST_URL, renderAge } from '../../model';
import { OrganizationCount } from '../../atoms';

interface ISliderList {
  title?: string;
  onClick?: (x?: any) => void;
  buttonText?: string;
  pushState: {
    title: string;
    path: string;
  };
  array: any[];
}

export const SliderList: React.FC<ISliderList> = ({
  array,
  title: sliderTitle,
  onClick,
  buttonText,
  pushState,
}) => {
  return (
    <>
      {(sliderTitle || buttonText) && (
        <div className={s.header}>
          {sliderTitle && <h2>{sliderTitle}</h2>}
          {buttonText && (
            <Button onClick={onClick} variant="link">
              {buttonText}
            </Button>
          )}
        </div>
      )}
      <ScrollableList>
        {array.map(
          ({ id, name, ageMin, ageMax, photo, organizationsCount = 0 }) => (
            <Link
              to={{
                pathname: `/disciplines/${id}`,
                state: pushState,
              }}
              className={s.item}
              key={id}
              title={name}
            >
              <div>
                <img
                  src={photo?.[0] ? HOST_URL + photo[0].url : scienceUrl}
                  alt={name}
                />
                {organizationsCount !== 0 && (
                  <OrganizationCount count={organizationsCount} />
                )}
              </div>
              <h2>{name}</h2>
              {(ageMin !== undefined || ageMax !== undefined) && (
                <span>{renderAge(ageMin, ageMax)}</span>
              )}
            </Link>
          )
        )}
      </ScrollableList>
    </>
  );
};
