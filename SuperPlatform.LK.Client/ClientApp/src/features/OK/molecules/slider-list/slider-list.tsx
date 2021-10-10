import React from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import 'swiper/swiper-bundle.css';

import cn from 'classnames';

import { Button } from '../../../../ui';
import s from './slider-list.module.scss';
import scienceUrl from '../../assets/science.png';
import { OK_HOST_URL, renderAge } from '../../model';
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
  const params = {
    slidesPerView: 'auto' as const,
    spaceBetween: 10,
    containerClass: s.slider,
    rebuildOnUpdate: true,
  };

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
      <Swiper {...params}>
        {array.map(
          ({ id, name, ageMin, ageMax, photo, organizationsCount = 0 }) => (
            <Link
              to={{
                pathname: `/disciplines/${id}`,
                state: pushState,
              }}
              className={cn(s.item, 'swiper-slide')}
              key={id}
              title={name}
            >
              <div>
                <img
                  src={photo?.[0] ? OK_HOST_URL + photo[0].url : scienceUrl}
                  alt={name}
                />
                {organizationsCount !== 0 && (
                  <OrganizationCount count={organizationsCount} />
                )}
              </div>
              <h2>{name}</h2>
              {(ageMin || ageMax) && <span>{renderAge(ageMin, ageMax)}</span>}
            </Link>
          )
        )}
      </Swiper>
    </>
  );
};
