import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { usePastLocationState } from '../../../../libs';
import { BackwardButton, MainTemplate, Select, AsyncWrap } from '../../../../ui';
import { $OCardStore, AGES, getAllFromOCard, isValidAge } from '../../model';
import { OrganizationOrDiscipline } from '../../molecules';

import s from './one-discipline-page.module.scss';
import { NoData } from '../../atoms';

export const OneDicsiplinePage = () => {
    const { id } = useParams<{id: string}>();
    const [age, setAge] = useState<number>(0);
    const { 
        disciplines,
        organizations,
        schedules,
        loading
    } = useStore($OCardStore);
    const { title, goBackFunc } = usePastLocationState();

    const onAgeSelectChange = useCallback(({ target: { value } }) => {
        setAge(Number(value));
    }, []);

    useEffect(() => {
        if (disciplines.data && organizations.data && schedules.data) return;

        getAllFromOCard();
    }, []);

    const currentDiscipline = useMemo(() => disciplines.data?.find((discipline) => discipline.id === Number(id)), [
        disciplines, 
        organizations, 
        schedules, 
        loading
    ]);

    const filteredSchedules = useMemo(() => schedules.data?.reduce((acc, curr) => {
        if (curr.disciplineId === Number(id) && isValidAge(age, curr.ageMin, curr.ageMax)) {
            const organization = organizations.data?.find(({ id: orgId }) => orgId === curr.organizationId);
            const discipline = disciplines.data?.find(({ id: disId }) => disId === curr.disciplineId);
            const orgIndex = acc.findIndex((org) => org.id === curr.organizationId);

            if (!organization) {
                return acc;
            }
    
            if (orgIndex >= 0) {
                acc[orgIndex] = {
                    ...acc[orgIndex],
                    schedules: acc[orgIndex]?.schedules?.concat(curr)
                };
            } else {
                acc.push({
                    ...organization,
                    hobby_name: curr?.name,
                    discipline_name: discipline?.name,
                    organization_name: organization?.name,
                    schedules: [curr],
                    ageMin: curr?.ageMin ?? null,
                    ageMax: curr?.ageMax ?? null,
                });
            }
        }

        return acc;
    }, []) ?? [], [age, loading, disciplines, organizations, schedules]);

    return (
        <MainTemplate
            header={<BackwardButton onClick={goBackFunc} text={title} />}
        >
            <div className={s.wrap}>
                <AsyncWrap
                    state={{
                        loading,
                        error: disciplines.error || organizations.error || schedules.error
                    }}
                >
                    <>
                        <div className={s.title}>{currentDiscipline?.name ?? ''}</div>
                        <Select
                            options={AGES}
                            onChange={onAgeSelectChange}
                            defaultValue="0"
                        />
                        <div className={s.list}>
                            {
                                filteredSchedules?.map((place) => (
                                    <OrganizationOrDiscipline 
                                        key={place.id} 
                                        pushState={{
                                            title: currentDiscipline?.name,
                                            path: `/disciplines/${id}`
                                        }}
                                        {...place} 
                                    />
                                ))
                            }
                        </div>
                        {!filteredSchedules?.length && (
                            <NoData back />
                        )}
                    </>
                </AsyncWrap>
            </div>
        </MainTemplate>
    );
};
