import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { usePastLocationState } from '../../../libs';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../ui';
import { $global } from '../../model';
import { OrganizationsList } from '../../molecules';

export const AllOrganizationsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { directions, loading } = useStore($global);
  const currentDirection = directions?.find(
    ({ id: directionId }) => Number(id) === directionId
  );

  // const filteredDisciplineIds =
  //   [
  //     ...new Set(
  //       disciplines?.data
  //         ?.filter(({ direction }) => direction?.id === Number(id))
  //         .map(({ id: disciplineId }) => disciplineId)
  //     ),
  //   ] ?? [];

  // const filteredOrganizationIds =
  //   [
  //     ...new Set(
  //       schedules?.data
  //         ?.filter(({ disciplineId }) =>
  //           filteredDisciplineIds.includes(disciplineId)
  //         )
  //         .map(({ organizationId }) => organizationId)
  //     ),
  //   ] ?? [];

  // const filteredOrganizations = organizations?.data?.filter(
  //   ({ id: organizationId }) => filteredOrganizationIds.includes(organizationId)
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
        <OrganizationsList array={[]} href="/organizations" />
      </AsyncWrap>
    </MainTemplate>
  );
};
