import React, { FC } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import { AsyncWrap, Avatar, BackwardButton, MainTemplate } from '../../../ui';
import { $global } from '../../model';
import { TextBlock } from '../../atoms';
import s from './child-page.module.scss';

export const ChildPage: FC = () => {
  const { children, loading } = useStore($global);
  const { id } = useParams();
  const history = useHistory();
  const currentChild = children?.find(({ id: childId }) => childId === id);

  const goBackFunc = (): void =>
    history.action === 'POP' ? history.push('/') : history.goBack();

  return (
    <MainTemplate
      header={
        <BackwardButton
          onClick={goBackFunc}
          text={currentChild?.fullName}
          extraElem={
            <Avatar
              className={s.avatar}
              variant="XS"
              src={currentChild?.avatar}
            />
          }
        />
      }
    >
      <AsyncWrap
        state={{
          loading,
        }}
      >
        <div className={s.wrap}>
          {currentChild?.sections?.map(
            ({ sectionName, sectionId, organizationName, sectionGroupId }) => (
              <Link key={sectionId} to={`/signed/${id}/${sectionGroupId}`}>
                <TextBlock
                  withDivider
                  withArrow
                  topText={sectionName}
                  bottomText={organizationName}
                />
              </Link>
            )
          )}
        </div>
      </AsyncWrap>
    </MainTemplate>
  );
};
