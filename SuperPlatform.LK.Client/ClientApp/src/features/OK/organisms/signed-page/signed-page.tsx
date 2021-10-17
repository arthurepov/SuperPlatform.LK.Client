import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { Link } from 'react-router-dom';
import { Child, HeaderTabs } from '../../atoms';
import { AsyncWrap, MainTemplate } from '../../../../ui';
import { $OCardStore } from '../../model';
import s from './signed-page.module.scss';

export const SignedPage: FC = () => {
  const { children, loading } = useStore($OCardStore);

  return (
    <MainTemplate
      header={
        <>
          <div className={s.title}>Дополнительное образование</div>
          <HeaderTabs />
        </>
      }
    >
      <AsyncWrap state={{ loading, error: children.error }}>
        <div>
          {children?.data?.map((child) => (
            <Link to={`/child/${child.id}`} key={child.id}>
              <Child withArrow {...child} bottomText="3 кружка" />
            </Link>
          ))}
        </div>
      </AsyncWrap>
    </MainTemplate>
  );
};
