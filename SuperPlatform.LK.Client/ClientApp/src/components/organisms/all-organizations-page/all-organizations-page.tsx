import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { request, usePastLocationState } from '../../../libs';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../ui';
import {
  $global,
  HOST_URL,
  IOrganization,
  ORGANIZATIONS_URL,
  setOrganization,
} from '../../model';
import { OrganizationsList } from '../../molecules';

export const AllOrganizationsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organizationError, setOrganizationError] = useState('');
  const [organizationLoading, setOrganizationLoading] = useState(false);
  const { organizations, directions, activeCity, loading } = useStore($global);
  const currentDirection = directions?.find(
    ({ id: directionId }) => Number(id) === directionId
  );

  useEffect(() => {
    const getOrganization = async (): Promise<void> => {
      try {
        setOrganizationLoading(true);

        const res = await request<IOrganization[]>({
          url: `${HOST_URL}${ORGANIZATIONS_URL}?cityId=${activeCity}`,
        })();

        setOrganization({
          direction: Number(id),
          organizations: res,
        });
      } catch ({ message }) {
        console.error(message);
        setOrganizationError(message);
      } finally {
        setOrganizationLoading(false);
      }
    };

    if (!organizations[id]) {
      getOrganization();
    }
  }, []);

  const { title, goBackFunc } = usePastLocationState({
    title: currentDirection?.name,
    path: `/directions/${id}`,
  });

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading: organizationLoading || loading,
          error: organizationError,
        }}
      >
        <OrganizationsList
          array={organizations[id] ?? []}
          href="/organizations"
        />
      </AsyncWrap>
    </MainTemplate>
  );
};
