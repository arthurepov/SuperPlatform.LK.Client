import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NoData, OrganizationCount, Title } from '../../atoms';
import { OK_HOST_URL, renderAge } from '../../model';

import scienceUrl from '../../assets/science.png';

import s from './wrap-list.module.scss';
import { SearchBar, Typography } from '../../../../ui';

interface IWrapList {
  array: any[];
  title: string;
  href: string;
  searchPanelText?: string;
}

export const WrapList: React.FC<IWrapList> = ({
  array,
  title,
  href,
  searchPanelText,
}) => {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const list = query.length
    ? array.filter(({ name }) =>
        name.toLowerCase().includes(query.toLocaleLowerCase())
      )
    : array;

  const pushState = {
    title,
    path: location.pathname,
  };

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  return (
    <>
      {searchPanelText && (
        <div className={s.search}>
          <SearchBar
            onChange={onSearchBarChange}
            placeholder={searchPanelText}
          />
        </div>
      )}
      <Title>{title}</Title>
      <div className={s.wrap}>
        {list?.length > 0 ? (
          list.map(
            ({ name, ageMin, ageMax, photo, id, organizationsCount = 0 }) => (
              <Link
                key={id}
                to={{
                  pathname: `${href}/${id}`,
                  state: pushState,
                }}
                className={s.item}
                title={name}
              >
                <div className={s.item_block}>
                  <img
                    src={photo?.[0] ? photo[0].url : scienceUrl}
                    alt={name}
                  />
                  {organizationsCount !== 0 && (
                    <OrganizationCount count={organizationsCount} />
                  )}
                </div>
                {(ageMin !== undefined || ageMax !== undefined) && (
                  <span>{renderAge(ageMin, ageMax)}</span>
                )}
                <Typography variant="h2">{name}</Typography>
              </Link>
            )
          )
        ) : (
          <div className={s.nothing}>
            <NoData />
          </div>
        )}
      </div>
    </>
  );
};
