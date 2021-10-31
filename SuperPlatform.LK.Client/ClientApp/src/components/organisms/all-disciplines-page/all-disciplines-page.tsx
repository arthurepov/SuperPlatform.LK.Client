import React, { FC, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { usePastLocationState } from '../../../libs';
import { BackwardButton, MainTemplate, AsyncWrap } from '../../../ui';
import { $global, setDisciplines } from '../../model';
import { WrapList } from '../../molecules';
import { DISCIPLINES_MOCK } from '../../model/mock';

export const AllDisciplinesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { directions, disciplines, activeCity, loading } = useStore($global);
  const currentDirection = directions.find(
    ({ id: directionId }) => Number(id) === directionId
  );

  const { title, goBackFunc } = usePastLocationState({
    title: currentDirection?.name,
    path: `/directions/${id}`,
  });

  useEffect(() => {
    const getDisciplines = async (): Promise<void> => {
      try {
        // const data = await request<IDiscipline[]>({
        //   url: `${HOST_URL}${DISCIPLINES_URL}?cityId=${activeCity}&directionId=${directionId}`,
        // })();

        // @ts-ignore
        setDisciplines({
          direction: id,
          disciplines: DISCIPLINES_MOCK.data,
        });
      } catch ({ message }) {
        console.error(message);
      }
    };

    if (!disciplines[id]) {
      getDisciplines();
    }
  }, [directions, disciplines, activeCity]);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading,
        }}
      >
        <WrapList
          array={disciplines[id] ?? []}
          title="Дисциплины"
          href="/disciplines"
          searchPanelText="Поиск"
        />
      </AsyncWrap>
    </MainTemplate>
  );
};
