import React, { FC, useState } from 'react';
import { useStore } from 'effector-react';
import { AsyncWrap, MainTemplate, SearchBar, Select } from '../../../../ui';
import { $global, setCity } from '../../model';
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
  const { directions, cities, activeCity, loading } = useStore($global);

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  const clearSearchBarQuery = (): void => {
    setQuery('');
  };

  // const filteredOrganizations = query.length
  //   ? organizations?.filter(({ name }) =>
  //       name.toLowerCase().includes(query.toLocaleLowerCase())
  //     )
  //   : [];

  // const anyResultExist = filteredOrganizations?.length > 0;

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
            options={cities?.map(({ id, name }) => ({
              value: id?.toString(),
              text: name,
            }))}
            value={activeCity ?? ''}
            onChange={({ target: { value } }) => setCity(Number(value))}
          />
        </div>
        {!query?.length && (
          <AsyncWrap
            state={{
              loading,
            }}
          >
            <div className={s.list}>
              <WrapList
                array={directions}
                title="Направления"
                href="directions"
              />
            </div>
          </AsyncWrap>
        )}
        {/* {anyResultExist && ( */}
        {/*  <div className={s.results}> */}
        {/*    <AsyncWrap */}
        {/*      state={{ */}
        {/*        loading, */}
        {/*        error: schedules.error, */}
        {/*      }} */}
        {/*    > */}
        {/*      {filteredHobbies?.length > 0 && ( */}
        {/*        <div className={s.hobbies}> */}
        {/*          <HobbySlider array={filteredHobbies} pushState={pushState} /> */}
        {/*        </div> */}
        {/*      )} */}
        {/*    </AsyncWrap> */}
        {/*    <AsyncWrap */}
        {/*      state={{ */}
        {/*        loading, */}
        {/*        error: disciplines.error, */}
        {/*      }} */}
        {/*    > */}
        {/*      {filteredDisciplines?.length > 0 && ( */}
        {/*        <div className={s.disciplines}> */}
        {/*          <SliderList */}
        {/*            array={filteredDisciplines} */}
        {/*            title="Дисциплины" */}
        {/*            pushState={pushState} */}
        {/*          /> */}
        {/*        </div> */}
        {/*      )} */}
        {/*    </AsyncWrap> */}
        {/*    <AsyncWrap */}
        {/*      state={{ */}
        {/*        loading, */}
        {/*        error: organizations.error, */}
        {/*      }} */}
        {/*    > */}
        {/*      {filteredOrganizations?.length > 0 && ( */}
        {/*        <div className={s.organizations}> */}
        {/*          <OrganizationSlider */}
        {/*            array={filteredOrganizations} */}
        {/*            pushState={pushState} */}
        {/*          /> */}
        {/*        </div> */}
        {/*      )} */}
        {/*    </AsyncWrap> */}
        {/*  </div> */}
        {/* )} */}
      </div>
      {![] && query.length > 0 && (
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
