import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useStore } from 'effector-react';
import { request, usePastLocationState, useRouter } from '../../../libs';
import {
  MainTemplate,
  AsyncWrap,
  SearchBar,
  BackwardButton,
} from '../../../ui';
import { NoData, RouterSlilderTabs } from '../../atoms';
import {
  $global,
  arrayFilteringFunc,
  DIRECTIONS_URL,
  DISCIPLINES_URL,
  HOST_URL,
  IDiscipline,
  IOrganization,
  ISection,
  ORGANIZATIONS_URL,
  setDisciplines,
  setOrganization,
  setSections,
} from '../../model';
import { HobbySlider, OrganizationSlider, SliderList } from '../../molecules';
import s from './direction-page.module.scss';

export const DirectionPage: FC = () => {
  const { id: directionId } = useParams<{ id: string }>();
  const [query, setQuery] = useState('');
  const [disciplineError, setDisciplineError] = useState('');
  const [disciplineLoading, setDisciplineLoading] = useState(false);
  const [sectionError, setSectionError] = useState('');
  const [sectionLoading, setSectionLoading] = useState(false);
  const [organizationError, setOrganizationError] = useState('');
  const [organizationLoading, setOrganizationLoading] = useState(false);
  const { history } = useRouter();
  const {
    directions,
    activeCity,
    sections,
    organizations,
    disciplines,
    loading,
  } = useStore($global);

  useEffect(() => {
    const getDisciplines = async (): Promise<void> => {
      try {
        setDisciplineLoading(true);
        const data = await request<IDiscipline[]>({
          url: `${HOST_URL}${DISCIPLINES_URL}?cityId=${activeCity}&directionId=${directionId}`,
        })();

        setDisciplines({
          direction: Number(directionId),
          disciplines: data,
        });
      } catch ({ message }) {
        console.error(message);
        setDisciplineError(message);
      } finally {
        setDisciplineLoading(false);
      }
    };

    const getSection = async (): Promise<void> => {
      try {
        setSectionLoading(true);

        const res = await request<ISection[]>({
          url: `${HOST_URL}${DIRECTIONS_URL}/${directionId}/sections`,
        })();

        setSections({
          direction: Number(directionId),
          sections: res,
        });
      } catch ({ message }) {
        console.error(message);
        setSectionError(message);
      } finally {
        setSectionLoading(false);
      }
    };

    const getOrganization = async (): Promise<void> => {
      try {
        setOrganizationLoading(true);

        const res = await request<IOrganization[]>({
          url: `${HOST_URL}${ORGANIZATIONS_URL}?cityId=${activeCity}`,
        })();

        setOrganization({
          direction: Number(directionId),
          organizations: res,
        });
      } catch ({ message }) {
        console.error(message);
        setOrganizationError(message);
      } finally {
        setOrganizationLoading(false);
      }
    };

    if (!organizations[directionId]) {
      getOrganization();
    }

    if (!sections[directionId]) {
      getSection();
    }

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

  const filteredSections = arrayFilteringFunc(sections[directionId], query);
  const filteredOrganizations = arrayFilteringFunc(
    organizations[directionId],
    query
  );

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
            loading: sectionLoading,
            error: sectionError,
          }}
        >
          {filteredSections?.length > 0 && (
            <div className={s.hobbies}>
              <HobbySlider
                array={filteredSections}
                onClick={() =>
                  history.push(`/directions/${directionId}/sections`, pushState)
                }
                pushState={pushState}
              />
            </div>
          )}
        </AsyncWrap>
        <AsyncWrap
          state={{
            loading: disciplineLoading,
            error: disciplineError,
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
            loading: organizationLoading,
            error: organizationError,
          }}
        >
          {filteredOrganizations?.length > 0 && (
            <div className={s.organizations}>
              <OrganizationSlider
                array={filteredOrganizations}
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
