import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, SearchBar } from '../../../ui';

import { NoData, Title } from '../../atoms';
import { ReactComponent as LocationIcon } from '../../../assets/images/location-icon.svg';

import s from './hobby-list.module.scss';

interface IHobbyList {
  array: any[];
  href: string;
}

export const HobbyList: React.FC<IHobbyList> = ({ array, href }) => {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const list = query.length
    ? array?.filter(({ name, address }) =>
        [name, address].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      )
    : array;

  const pushState = {
    title: 'Кружки и секции',
    path: location.pathname,
  };

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <Title>Кружки и секции</Title>
        <Link
          to={{
            pathname: 'organizations/map',
            state: pushState,
          }}
        >
          <Button variant="link" icon={<LocationIcon />}>
            Посмотреть на карте
          </Button>
        </Link>
      </div>
      <div className={s.search}>
        <SearchBar onChange={onSearchBarChange} placeholder="Поиск" />
      </div>
      {list?.length > 0 ? (
        list.map(({ name, disciplineId, address, organizationName }) => (
          <Link
            key={disciplineId + name + address}
            to={{
              pathname: `${href}/${disciplineId}`,
              state: pushState,
            }}
            className={s.item}
          >
            <div>
              <div className={s.item_title}>{name}</div>
              <div className={s.item_address}>{address}</div>
              <div className={s.item_organizationName}>{organizationName}</div>
            </div>
          </Link>
        ))
      ) : (
        <div className={s.nothing}>
          <NoData />
        </div>
      )}
    </div>
  );
};
