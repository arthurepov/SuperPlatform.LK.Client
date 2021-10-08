import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, SearchBar } from '../../../../ui';

import { MetroStation, NoData, Title } from '../../atoms';
import { ReactComponent as LocationIcon } from '../../../../assets/images/location-icon.svg';

import s from './organizations-list.module.scss';

interface IOrganizationsList {
    array: any[];
    href: string;
}

export const OrganizationsList: React.FC<IOrganizationsList> = ({ array, href }) => {
    const [query, setQuery] = useState('');
    const location = useLocation();
    const list = query.length
        ? array
            ?.filter(({ name, address }) => [name, address]
                .some((value) => value
                    .toLowerCase()
                    .includes(query.toLowerCase())))
        : array;

    const pushState = {
        title: 'Организации',
        path: location.pathname
    };

    const onSearchBarChange = ({ target: { value } }) => {
        setQuery(value);
    };

    return (
        <div className={s.wrap}>
            <div className={s.header}>
                <Title>Организации</Title>
                <Link 
                    to={{
                        pathname: 'organizations/map',
                        state: pushState
                    }}
                >
                    <Button
                        variant="link"
                        icon={<LocationIcon />}
                    >
                        Посмотреть на карте
                    </Button>
                </Link>
            </div>
            <div className={s.search}>
                <SearchBar onChange={onSearchBarChange} placeholder='Поиск' />
            </div>
            {
                list?.length > 0
                    ? list.map(({ name, id, address, station }) => (
                        <Link 
                            key={id} 
                            to={{ 
                                pathname: `${href}/${id}`, 
                                state: pushState 
                            }} 
                            className={s.item}
                        >
                            <div>
                                <div className={s.item_title}>{name}</div>
                                <div className={s.item_address}>{address}</div>
                                {station && <MetroStation>{station}</MetroStation>}
                            </div>
                        </Link>
                    ))
                    : (
                        <div className={s.nothing}>
                            <NoData />
                        </div>
                    )
            }
        </div>
    );
};
