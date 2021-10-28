import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { Link } from 'react-router-dom';
import { Child, HeaderTabs } from '../../atoms';
import { AsyncWrap, MainTemplate } from '../../../../ui';
import { $global } from '../../model';
import s from './signed-page.module.scss';

export const SignedPage: FC = () => {
  const { children, loading } = useStore($global);

  return (
    <MainTemplate
      header={
        <>
          <div className={s.title}>Дополнительное образование</div>
          <HeaderTabs />
        </>
      }
    >
      <AsyncWrap state={{ loading }}>
        <div>
          {children?.map((child) => (
            <Link to={`/child/${child.id}`} key={child.id}>
              <Child withArrow {...child} />
            </Link>
          ))}
        </div>
      </AsyncWrap>
    </MainTemplate>
  );
};
