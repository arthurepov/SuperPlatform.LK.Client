import React, { FC, useState } from 'react';
import { useStore } from 'effector-react';

import { AsyncWrap, MainTemplate, SearchBar, Select } from '../../../../ui';
import { $OCardStore, selectCity } from '../../model';
import {
  HobbySlider,
  OrganizationSlider,
  SliderList,
  WrapList,
} from '../../molecules';
import { HeaderTabs, NoData } from '../../atoms';
import s from './all-directions-page.module.scss';

export const AllDirectionsPage: FC = () => {
  const [query, setQuery] = useState('');
  const {
    directions,
    disciplines,
    organizations,
    schedules,
    hobbies,
    cities,
    selectedCity,
    loading,
  } = useStore($OCardStore);

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  const clearSearchBarQuery = (): void => {
    setQuery('');
  };

  const filteredHobbies = query.length
    ? hobbies?.data?.filter(({ name }) =>
        name.toLowerCase().includes(query.toLocaleLowerCase())
      )
    : [];

  const filteredDisciplines = query.length
    ? disciplines?.data?.filter(({ name }) =>
        name.toLowerCase().includes(query.toLocaleLowerCase())
      )
    : [];

  const filteredOrganizations = query.length
    ? organizations?.data?.filter(({ name }) =>
        name.toLowerCase().includes(query.toLocaleLowerCase())
      )
    : [];

  const anyResultExist =
    filteredHobbies?.length > 0 ||
    filteredDisciplines?.length > 0 ||
    filteredOrganizations?.length > 0;

  const pushState = {
    title: 'Дополнительное образование',
    path: '/',
  };

  return (
    <MainTemplate
      header={
        <>
          <h1 className={s.main_title}>Дополнительное образование</h1>
          <HeaderTabs />
        </>
      }
    >
      <div className={s.wrap}>
        <div className={s.search}>
          <SearchBar
            value={query}
            onChange={onSearchBarChange}
            placeholder="Поиск"
          />
        </div>
        <div className={s.city}>
          <Select
            options={cities.data?.map(({ id, name }) => ({
              value: id?.toString(),
              text: name,
            }))}
            value={selectedCity ?? ''}
            onChange={({ target: { value } }) => selectCity(Number(value))}
          />
        </div>
        {!query?.length && (
          <AsyncWrap
            state={{
              loading,
              error: directions.error,
            }}
          >
            <div className={s.list}>
              <WrapList
                array={directions?.data}
                title="Направления"
                href="directions"
              />
            </div>
          </AsyncWrap>
        )}
        {anyResultExist && (
          <div className={s.results}>
            <AsyncWrap
              state={{
                loading,
                error: schedules.error,
              }}
            >
              {filteredHobbies?.length > 0 && (
                <div className={s.hobbies}>
                  <HobbySlider array={filteredHobbies} pushState={pushState} />
                </div>
              )}
            </AsyncWrap>
            <AsyncWrap
              state={{
                loading,
                error: disciplines.error,
              }}
            >
              {filteredDisciplines?.length > 0 && (
                <div className={s.disciplines}>
                  <SliderList
                    array={filteredDisciplines}
                    title="Дисциплины"
                    pushState={pushState}
                  />
                </div>
              )}
            </AsyncWrap>
            <AsyncWrap
              state={{
                loading,
                error: organizations.error,
              }}
            >
              {filteredOrganizations?.length > 0 && (
                <div className={s.organizations}>
                  <OrganizationSlider
                    array={filteredOrganizations}
                    pushState={pushState}
                  />
                </div>
              )}
            </AsyncWrap>
          </div>
        )}
      </div>
      {!anyResultExist && query.length > 0 && (
        <div className={s.nothing}>
          <NoData
            buttonText="Вернуться в каталог"
            onClick={clearSearchBarQuery}
          />
        </div>
      )}
    </MainTemplate>
  );
};
