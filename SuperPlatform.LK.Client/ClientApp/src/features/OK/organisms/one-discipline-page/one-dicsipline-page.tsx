import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { useParams } from 'react-router';
import { usePastLocationState } from '../../../../libs';
import {
  BackwardButton,
  MainTemplate,
  Select,
  AsyncWrap,
} from '../../../../ui';
import { $global, AGES, getData, isValidAge } from '../../model';
import { OrganizationOrDiscipline } from '../../molecules';

import s from './one-discipline-page.module.scss';
import { NoData } from '../../atoms';

export const OneDicsiplinePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [age, setAge] = useState<number>(0);
  const { organizations, loading } = useStore($global);
  const { title, goBackFunc } = usePastLocationState();

  const onAgeSelectChange = useCallback(({ target: { value } }) => {
    setAge(Number(value));
  }, []);

  return (
    <MainTemplate header={<BackwardButton onClick={goBackFunc} text={title} />}>
      <div className={s.wrap}>
        <AsyncWrap
          state={{
            loading,
          }}
        >
          <>
            <div className={s.title}>asd</div>
            <Select
              options={AGES}
              onChange={onAgeSelectChange}
              defaultValue="0"
            />
            <div className={s.list}>
              {[].map((place) => (
                <OrganizationOrDiscipline
                  key={place.id}
                  pushState={{
                    title: 'asfasfasf',
                    path: `/disciplines/${id}`,
                  }}
                  {...place}
                />
              ))}
            </div>
            {![].length && <NoData back />}
          </>
        </AsyncWrap>
      </div>
    </MainTemplate>
  );
};
