import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { request, usePastLocationState } from '../../../libs';
import { HOST_URL, ISection, SECTION_URL } from '../../model';
import { AsyncWrap, BackwardButton, MainTemplate } from '../../../ui';
import { SectionInfo } from '../../molecules';
import s from './hobby-page.module.scss';

export const HobbyPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getSection = async (): Promise<void> => {
      try {
        setLoading(true);

        const res = await request<ISection[]>({
          url: `${HOST_URL}${SECTION_URL}/${id}`,
        })();

        setData(res);
      } catch ({ message }) {
        console.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getSection();
  }, []);

  const pushState = {
    title: data?.name,
    path: `/section/${id}`,
  };

  const { title, goBackFunc } = usePastLocationState({
    title: 'Направления',
    path: '/',
  });

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <AsyncWrap
        state={{
          loading,
          error,
        }}
      >
        <SectionInfo className={s.root} pushState={pushState} {...data} />
      </AsyncWrap>
    </MainTemplate>
  );
};
