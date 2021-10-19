import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { usePastLocationState } from '../../../../libs';
import { BackwardButton, MainTemplate, AsyncWrap } from '../../../../ui';
import { $OCardStore } from '../../model';
import { WrapList } from '../../molecules';

export const AllDisciplinesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { directions, disciplines, loading } = useStore($OCardStore);
  const currentDirection = directions?.data?.find(
    ({ id: directionId }) => Number(id) === directionId
  );
  const filteredDisciplines =
    disciplines?.data?.filter(
      ({ direction }) => direction?.id === Number(id)
    ) ?? [];

  const { title, goBackFunc } = usePastLocationState({
    title: currentDirection?.name,
    path: `/directions/${id}`,
  });

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading,
          error: disciplines.error,
        }}
      >
        <WrapList
          array={filteredDisciplines}
          title="Дисциплины"
          href="/disciplines"
          searchPanelText="Поиск"
        />
      </AsyncWrap>
    </MainTemplate>
  );
};
