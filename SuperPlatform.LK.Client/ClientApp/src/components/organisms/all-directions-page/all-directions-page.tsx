import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useDebounce } from 'use-debounce';
import { AsyncWrap, MainTemplate, SearchBar, Select } from '../../../ui';
import { $global, HOST_URL, setCity, SUGGESTIONS_URL } from '../../model';
import { HobbySlider, OrganizationSlider, WrapList } from '../../molecules';
import { HeaderTabs, NoData } from '../../atoms';
import s from './all-directions-page.module.scss';
import { request } from '../../../libs';

export const AllDirectionsPage: FC = () => {
  const [text, setText] = useState('');
  const [query] = useDebounce(text, 500);
  const { directions, cities, activeCity, loading } = useStore($global);
  const [suggestions, setSuggestions] = useState<any>({});
  const [sugLoading, setSugLoading] = useState(false);
  const [error, setError] = useState('');

  const onSearchBarChange = ({ target: { value } }): void => {
    setText(value);
  };

  const clearSearchBarQuery = (): void => {
    setText('');
  };

  const getSuggestions = async (): Promise<void> => {
    try {
      setSugLoading(true);
      const newSuggestions = await request<any>({
        url: `${HOST_URL}${SUGGESTIONS_URL}?query=${query}`,
      })();

      setSuggestions(newSuggestions);
    } catch ({ message }) {
      console.error(message);
      setError(message);
    } finally {
      setSugLoading(false);
    }
  };

  useEffect(() => {
    if (query?.length >= 3) {
      getSuggestions();
    }
  }, [query]);

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
            value={text}
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
        {query?.length < 3 && (
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
        {query?.length >= 3 && suggestions?.suggestionSections && (
          <AsyncWrap
            state={{
              loading: sugLoading,
              error,
            }}
          >
            <div className={s.hobbies}>
              <HobbySlider
                array={suggestions?.suggestionSections}
                pushState={pushState}
              />
            </div>
          </AsyncWrap>
        )}
        {query?.length >= 3 && suggestions?.sggestionOrganizations && (
          <AsyncWrap
            state={{
              loading: sugLoading,
              error,
            }}
          >
            <div className={s.organizations}>
              <OrganizationSlider
                array={suggestions?.suggestionSections}
                pushState={pushState}
              />
            </div>
          </AsyncWrap>
        )}
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
