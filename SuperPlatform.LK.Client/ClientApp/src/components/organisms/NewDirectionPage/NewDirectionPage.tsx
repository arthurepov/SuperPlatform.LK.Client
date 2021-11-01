import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import {
  AsyncWrap,
  BackwardButton,
  MainTemplate,
  SearchBar,
} from '../../../ui';
import { request, usePastLocationState } from '../../../libs';
import {
  $global,
  arrayFilteringFunc,
  DIRECTIONS_URL,
  HOST_URL,
  ISection,
  setSections,
} from '../../model';
import { NoData, RouterSlilderTabs } from '../../atoms';
import { SectionInfo } from '../../molecules';
import s from './NewDirectionPage.module.scss';

export const NewDirectionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sectionLoading, setSectionLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { directions, activeCity, sections, disciplines, loading } =
    useStore($global);

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  const clearSearchBarQuery = (): void => {
    setQuery('');
  };

  useEffect(() => {
    const getSection = async (): Promise<void> => {
      try {
        setSectionLoading(true);

        const res = await request<ISection[]>({
          url: `${HOST_URL}${DIRECTIONS_URL}/${id}/sections`,
        })();

        setSections({
          direction: Number(id),
          sections: res,
        });
      } catch ({ message }) {
        console.error(message);
        setError(message);
      } finally {
        setSectionLoading(false);
      }
    };

    if (!sections[id]) {
      getSection();
    }
  }, [disciplines, id, activeCity]);

  const currentDirection = directions?.find(
    ({ id: directionId }) => directionId === Number(id)
  );

  const pushState = {
    title: currentDirection?.name,
    path: `/directions/${id}`,
  };

  const { title, goBackFunc } = usePastLocationState({
    title: 'Направления',
    path: '/',
  });

  const fileredSections = arrayFilteringFunc(sections[id], query);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <RouterSlilderTabs />
      <div className={s.search}>
        <SearchBar
          value={query}
          onChange={onSearchBarChange}
          placeholder="Поиск"
        />
      </div>
      <AsyncWrap
        state={{
          loading: loading || sectionLoading,
          error,
        }}
      >
        <div className={s.wrap}>
          {fileredSections?.map((section) => (
            <SectionInfo pushState={pushState} key={section.id} {...section} />
          ))}
        </div>
      </AsyncWrap>
      {!fileredSections?.length && query.length > 0 && (
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
