import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { usePastLocationState } from '../../../../libs';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../../ui';
import { $global } from '../../model';
import { HobbyList } from '../../molecules';

export const AllHobbiesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { directions, loading } = useStore($global);

  const currentDirection = directions?.find(
    ({ id: directionId }) => Number(id) === directionId
  );

  // const filteredDisciplineIds =
  //   disciplines?.data
  //     ?.filter(({ direction }) => direction?.id === Number(id))
  //     .map(({ id: disciplineId }) => disciplineId) ?? [];

  // const filteredHobbies = hobbies?.data?.filter(({ disciplineId }) =>
  //   filteredDisciplineIds.includes(disciplineId)
  // );

  const { title, goBackFunc } = usePastLocationState({
    title: currentDirection?.name,
    path: `/directions/${id}`,
  });

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading,
        }}
      >
        <HobbyList array={[]} href="/disciplines" />
      </AsyncWrap>
    </MainTemplate>
  );
};
