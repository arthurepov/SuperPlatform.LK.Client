import React from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import 'swiper/swiper-bundle.css';

import cn from 'classnames';

import { Button } from '../../../../ui';
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

export const OrganizationSlider: React.FC<IOrganizationSlider> = ({ onClick, array, pushState }) => {
    const params = {
        slidesPerView: 'auto' as 'auto',
        spaceBetween: 10,
        containerClass: s.slider,
        rebuildOnUpdate: true,
    };

    return (
        <>
            <div className={s.header}>
                <h2>Организации</h2>
                {onClick && <Button onClick={onClick} variant="link">Смотреть все</Button>}
            </div>
            <Swiper {...params}>
                {
                    array.map(({ id, name, address, station }) => (
                        <Link 
                            to={{ 
                                pathname: `/organizations/${id}`, 
                                state: pushState 
                            }} 
                            className={cn(s.item, 'swiper-slide')} 
                            key={id}
                        >
                            <div>
                                <div className={s.title}>{name}</div>
                                <div className={s.address}>{address}</div>
                                {station && <MetroStation style={{ marginTop: 'auto' }}>{station}</MetroStation>}
                            </div>
                        </Link>
                    ))
                }
            </Swiper>
        </>
    );
};
