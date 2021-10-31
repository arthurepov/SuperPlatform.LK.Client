import React, { FC, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { request, usePastLocationState } from '../../../libs';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../ui';
import {
  $global,
  DIRECTIONS_URL,
  HOST_URL,
  ISection,
  setSections,
} from '../../model';
import { HobbyList } from '../../molecules';

export const AllHobbiesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { directions, sections, loading } = useStore($global);
  const [sectionError, setSectionError] = useState('');
  const [sectionLoading, setSectionLoading] = useState(false);

  const currentDirection = directions?.find(
    ({ id: directionId }) => Number(id) === directionId
  );

  const { title, goBackFunc } = usePastLocationState({
    title: currentDirection?.name,
    path: `/directions/${id}`,
  });

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
        setSectionError(message);
      } finally {
        setSectionLoading(false);
      }
    };

    if (!sections[id]) {
      getSection();
    }
  }, []);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading: sectionLoading,
          error: sectionError,
        }}
      >
        <HobbyList array={sections[id] ?? []} href="/disciplines" />
      </AsyncWrap>
    </MainTemplate>
  );
};
