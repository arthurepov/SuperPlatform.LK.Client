import React, { FC } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { useStore } from 'effector-react';
import {
  AsyncWrap,
  Avatar,
  BackwardButton,
  MainTemplate,
} from '../../../../ui';
import { $OCardStore } from '../../model';
import { TextBlock } from '../../atoms';
import s from './child-page.module.scss';

export const ChildPage: FC = () => {
  const { children, directions, loading } = useStore($OCardStore);
  const { id } = useParams();
  const history = useHistory();
  const currentChild = children.data?.find(({ id: childId }) => childId === id);

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
          error: children.error,
        }}
      >
        <div className={s.wrap}>
          {directions.data?.map(({ name, id: directionId }) => (
            <Link key={directionId} to={`/signed/${directionId}`}>
              <TextBlock
                withDivider
                withArrow
                topText={name}
                bottomText={directionId}
              />
            </Link>
          ))}
        </div>
      </AsyncWrap>
    </MainTemplate>
  );
};
