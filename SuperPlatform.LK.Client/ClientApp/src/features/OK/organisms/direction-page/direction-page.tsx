import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useStore } from 'effector-react';
import { usePastLocationState, useRouter } from '../../../../libs';
import { MainTemplate, AsyncWrap, SearchBar, BackwardButton } from '../../../../ui';
import { NoData, RouterSlilderTabs } from '../../atoms';
import { $OCardStore } from '../../model';
import { HobbySlider, OrganizationSlider, SliderList } from '../../molecules';

import s from './direction-page.module.scss';

export const DirectionPage = () => {
    const { id } = useParams<{id: string}>();
    const [query, setQuery] = useState('');
    const { history } = useRouter();
    const {
        directions,
        disciplines,
        organizations,
        schedules,
        hobbies,
        loading
    } = useStore($OCardStore);

    const currentDirection = directions?.data?.find(({ id: directionId }) => Number(id) === directionId);
    const disciplinesArray = disciplines?.data?.filter(({ direction }) => direction?.id === Number(id)) ?? [];
    const disciplinesIdsArray = disciplinesArray?.map(({ id: disciplineId }) => disciplineId) ?? [];
    const hobbiesArray = hobbies?.data?.filter(({ disciplineId }) => disciplinesIdsArray.includes(disciplineId)) ?? [];
    const organizationsIdsArray = [...new Set(disciplinesArray.map(({ organizationsIds }) => organizationsIds).flat())];
    const organizationsArray = organizations?.data
        ?.filter(({ id: organizationId }) => organizationsIdsArray.includes(organizationId)) ?? [];

    const pushState = {
        title: currentDirection?.name,
        path: `/directions/${id}`
    };

    const { title, goBackFunc } = usePastLocationState({
        title: 'Направления',
        path: '/',
    });

    const filteredHobbies = query?.length
        ? hobbiesArray?.filter(({ name, address, organizationName }) => [name, address, organizationName]
            .some((value) => value
                .toLowerCase()
                .includes(query.toLowerCase())))
        : [];

    const filteredDisciplines = query.length
        ? disciplinesArray?.filter(({ name }) => name
            .toLowerCase()
            .includes(query.toLowerCase()))
        : disciplinesArray;

    const filteredOrganizations = query.length
        ? organizationsArray?.filter(({ name, address }) => [name, address]
            .some((value) => value
                .toLowerCase()
                .includes(query.toLowerCase())))
        : organizationsArray;

    const onSearchBarChange = ({ target: { value } }) => {
        setQuery(value);
    };

    const clearSearchBarQuery = () => {
        setQuery('');
    };

    const anyResultExist = filteredHobbies?.length > 0 
        || filteredDisciplines?.length > 0 
        || filteredOrganizations?.length > 0;

    return (
        <MainTemplate
            header={<BackwardButton onClick={goBackFunc} text={title} />}
        >
            <div className={s.wrap}>
                <RouterSlilderTabs />
                <div className={s.search}>
                    <SearchBar
                        value={query}
                        onChange={onSearchBarChange} 
                        placeholder='Поиск'
                    />
                </div>
                <AsyncWrap
                    state={{
                        loading,
                        error: schedules.error
                    }}
                >
                    {filteredHobbies?.length > 0 && (
                        <div className={s.hobbies}>
                            <HobbySlider
                                array={filteredHobbies}
                                onClick={() => history.push(`/directions/${id}/hobbies`, pushState)}
                                pushState={pushState}
                            />
                        </div>
                    )}
                </AsyncWrap>
                <AsyncWrap
                    state={{
                        loading,
                        error: disciplines.error
                    }}
                >
                    {filteredDisciplines?.length > 0 && (
                        <div className={s.disciplines}>
                            <SliderList
                                array={filteredDisciplines}
                                title="Дисциплины"
                                buttonText="Смотреть все"
                                onClick={() => history.push(`/directions/${id}/disciplines`, pushState)}
                                pushState={pushState}
                            />
                        </div>
                    )}
                </AsyncWrap>
                <AsyncWrap
                    state={{
                        loading,
                        error: organizations.error
                    }}
                >
                    {filteredOrganizations?.length > 0 && (
                        <div className={s.organizations}>
                            <OrganizationSlider
                                array={filteredOrganizations}
                                onClick={() => history.push(`/directions/${id}/organizations`, pushState)}
                                pushState={pushState}
                            />
                        </div>
                    )}
                </AsyncWrap>
                {(!anyResultExist && query.length > 0) && (
                    <div className={s.nothing}>
                        <NoData
                            buttonText='Вернуться в каталог'
                            onClick={clearSearchBarQuery}
                        />
                    </div>
                )}
            </div>
        </MainTemplate>
    );
};
