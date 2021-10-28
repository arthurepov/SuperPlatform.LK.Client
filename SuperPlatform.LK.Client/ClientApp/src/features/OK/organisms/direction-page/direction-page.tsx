import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useStore } from 'effector-react';
import { request, usePastLocationState, useRouter } from '../../../../libs';
import {
  MainTemplate,
  AsyncWrap,
  SearchBar,
  BackwardButton,
} from '../../../../ui';
import { NoData, RouterSlilderTabs } from '../../atoms';
import {
  $global,
  DISCIPLINES_URL,
  HOST_URL,
  IDiscipline,
  setDisciplines,
} from '../../model';
import { HobbySlider, OrganizationSlider, SliderList } from '../../molecules';
import s from './direction-page.module.scss';
import { DISCIPLINES_MOCK } from '../../model/mock';

export const DirectionPage: FC = () => {
  const { id: directionId } = useParams<{ id: string }>();
  const [query, setQuery] = useState('');
  const { history } = useRouter();
  const { directions, activeCity, disciplines, loading } = useStore($global);

  useEffect(() => {
    const getDisciplines = async (): Promise<void> => {
      try {
        // const data = await request<IDiscipline[]>({
        //   url: `${HOST_URL}${DISCIPLINES_URL}?cityId=${activeCity}&directionId=${directionId}`,
        // })();

        // @ts-ignore
        setDisciplines({
          direction: directionId,
          disciplines: DISCIPLINES_MOCK.data,
        });
      } catch ({ message }) {
        console.error(message);
      }
    };

    if (!disciplines[directionId]) {
      getDisciplines();
    }
  }, [disciplines, directionId, activeCity]);

  const currentDirection = directions?.find(
    ({ id }) => id === Number(directionId)
  );

  const pushState = {
    title: currentDirection?.name,
    path: `/directions/${directionId}`,
  };

  const { title, goBackFunc } = usePastLocationState({
    title: 'Направления',
    path: '/',
  });

  const onSearchBarChange = ({ target: { value } }): void => {
    setQuery(value);
  };

  const clearSearchBarQuery = (): void => {
    setQuery('');
  };

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <div className={s.wrap}>
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
            loading,
          }}
        >
          {[].length > 0 && (
            <div className={s.hobbies}>
              <HobbySlider
                array={[]}
                onClick={() =>
                  history.push(`/directions/${directionId}/hobbies`, pushState)
                }
                pushState={pushState}
              />
            </div>
          )}
        </AsyncWrap>
        <AsyncWrap
          state={{
            loading,
          }}
        >
          {disciplines[directionId]?.length > 0 && (
            <div className={s.disciplines}>
              <SliderList
                array={disciplines[directionId]}
                title="Дисциплины"
                buttonText="Смотреть все"
                onClick={() =>
                  history.push(
                    `/directions/${directionId}/disciplines`,
                    pushState
                  )
                }
                pushState={pushState}
              />
            </div>
          )}
        </AsyncWrap>
        <AsyncWrap
          state={{
            loading,
          }}
        >
          {[].length > 0 && (
            <div className={s.organizations}>
              <OrganizationSlider
                array={[]}
                onClick={() =>
                  history.push(
                    `/directions/${directionId}/organizations`,
                    pushState
                  )
                }
                pushState={pushState}
              />
            </div>
          )}
        </AsyncWrap>
        {![] && query.length > 0 && (
          <div className={s.nothing}>
            <NoData
              buttonText="Вернуться в каталог"
              onClick={clearSearchBarQuery}
            />
          </div>
        )}
      </div>
    </MainTemplate>
  );
};
